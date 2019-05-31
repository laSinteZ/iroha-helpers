import txHelper from './txHelper'
import { TxStatus, TxStatusRequest } from './proto/endpoint_pb'

function _listToTorii (txs, txClient, timeoutLimit) {
  const txList = txHelper.createTxListFromArray(txs)
  return new Promise((resolve, reject) => {
    /**
     * grpc-node hangs against unresponsive server, which possibly occur when
     * invalid node IP is set. To avoid this problem, we use timeout timer.
     * c.f. {@link https://github.com/grpc/grpc/issues/13163 Grpc issue 13163}
     */

    const timer = setTimeout(() => {
      txClient.$channel.close()
      reject(new Error('Please check IP address OR your internet connection'))
    }, timeoutLimit)

    // Sending even 1 transaction to listTorii is absolutely ok and valid.
    txClient.listTorii(txList, (err, data) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      const hashes = txs.map(x => txHelper.hash(x))
      resolve(hashes)
    })
  })
}

function _getTxStatus (hash, txClient) {
  return new Promise((resolve, reject) => {
    const request = new TxStatusRequest()
    request.setTxHash(hash.toString('hex'))
    txClient.status(request, (err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

function _handleStream (hash, txClient) {
  const request = new TxStatusRequest()
  request.setTxHash(hash.toString('hex'))
  return txClient.statusStream(request)
}

// function _statusChecker (hash, txClient, requiredStatusesStr) {
//   const TIMEOUT_LIMIT = 5000
//   const terminalStatuses = [
//     TxStatus.STATELESS_VALIDATION_FAILED,
//     TxStatus.STATEFUL_VALIDATION_FAILED,
//     TxStatus.COMMITTED,
//     TxStatus.MST_EXPIRED,
//     TxStatus.NOT_RECEIVED,
//     TxStatus.REJECTED
//   ]
//   const requiredStatuses = requiredStatusesStr.map(s => TxStatus[s])

//   const isTerminal = (status) => terminalStatuses.includes(status)
//   const isRequired = (status) => requiredStatuses.includes(status)

//   return new Promise((resolve, reject) => {
//     const cheker = setInterval((startDate) => {
//       _getTxStatus(hash, txClient)
//         .then(tx => {
//           const status = tx.getTxStatus()
//           if (isTerminal(status) || isRequired(status)) {
//             clearInterval(cheker)
//             resolve(tx)
//           }

//           const diffTime = Date.now() - startDate

//           if (diffTime > TIMEOUT_LIMIT) {
//             clearInterval(cheker)
//             reject(tx)
//           }
//         })
//         .catch(err => {
//           clearInterval(cheker)
//           reject(err)
//         })
//     }, 1 * 1000, Date.now())
//   })
// }

function fromStream (stream, requiredStatusesStr) {
  const terminalStatuses = [
    TxStatus.STATELESS_VALIDATION_FAILED,
    TxStatus.STATEFUL_VALIDATION_FAILED,
    TxStatus.COMMITTED,
    TxStatus.MST_EXPIRED,
    TxStatus.NOT_RECEIVED,
    TxStatus.REJECTED
  ]
  const requiredStatuses = requiredStatusesStr.map(s => TxStatus[s])

  const isTerminal = (status) => terminalStatuses.includes(status)
  const isRequired = (status) => requiredStatuses.includes(status)

  return new Promise((resolve, reject) => {
    const dataHandler = (tx) => {
      if (isTerminal(tx.getTxStatus()) || isRequired(tx.getTxStatus())) {
        resolve({ tx, status: true })
      }
    }

    const closeStream = () => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ status: false })
      }, 5000)
    }

    stream.on('data', dataHandler)
    closeStream()
  })
}

async function _streamCheker (hash, txClient, requiredStatusesStr) {
  let isChecking = true
  let result = null

  while (isChecking) {
    result = await fromStream(_handleStream(hash, txClient), requiredStatusesStr)
    if (result.status) {
      isChecking = false
    }
  }

  console.log('YAY', result)
  return result
}

/**
 * Capitalizes string
 * @param {String} string
 * @returns {String} capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const protoEnumName = {}
function getProtoEnumName (obj, key, value) {
  if (protoEnumName.hasOwnProperty(key)) {
    if (protoEnumName[key].length < value) {
      return 'unknown'
    } else {
      return protoEnumName[key][value]
    }
  } else {
    protoEnumName[key] = []
    for (let k in obj) {
      let idx = obj[k]
      if (isNaN(idx)) {
        throw Error(`getProtoEnumName:wrong enum value, now is type of ${typeof idx} should be integer`)
      } else {
        protoEnumName[key][idx] = k
      }
    }
    return getProtoEnumName(obj, key, value)
  }
}

function sendTransactions (txs, txClient, timeoutLimit, requiredStatusesStr = [
  'MST_PENDING',
  'COMMITTED'
]) {
  return _listToTorii(txs, txClient, timeoutLimit)
    .then(hashes => {
      return new Promise((resolve, reject) => {
        const requests = hashes.map(h => _streamCheker(h, txClient, requiredStatusesStr))

        Promise.all(requests)
          .then(res => {
            const status = res.map(r => getProtoEnumName(TxStatus, 'iroha.protocol.TxStatus', r.tx.getTxStatus()))
            return res.some(r => r.status) ? resolve() : reject(
              new Error(`Command response error: expected=${requiredStatusesStr}, actual=${status}`)
            )
          })
      })
    })
}

function signWithArrayOfKeys (tx, privateKeys) {
  privateKeys.forEach(key => {
    tx = txHelper.sign(tx, key)
  })
  return tx
}

export {
  capitalize,
  getProtoEnumName,
  sendTransactions,
  signWithArrayOfKeys
}

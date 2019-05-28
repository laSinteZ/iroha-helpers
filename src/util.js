import txHelper from './txHelper'
import { TxStatus, TxStatusRequest } from './proto/endpoint_pb'

import { from, Observable } from 'rxjs'
import { map, concatMap, toArray } from 'rxjs/operators'

function _listToTorii (txs, txClient, timeoutLimit) {
  const txList = txHelper.createTxListFromArray(txs)

  return from(
    new Promise((resolve, reject) => {
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
  )
}

function fromStream (stream) {
  return new Observable((observer) => {
    function dataHandler (data) {
      observer.next(data)
    }

    function endHandler () {
      observer.complete()
    }

    stream.on('data', dataHandler)
    stream.on('end', endHandler)
  })
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

function sendTransactions (txs, txClient, timeoutLimit, requiredStatuses = [
  'MST_PENDING',
  'COMMITTED'
]) {
  return _listToTorii(txs, txClient, timeoutLimit)
    .pipe(
      concatMap(hashes => {
        const request = new TxStatusRequest()
        request.setTxHash(hashes[0].toString('hex'))
        return fromStream(
          txClient.statusStream(request)
        )
      }),
      map(tx => getProtoEnumName(
        TxStatus,
        'iroha.protocol.TxStatus',
        tx.getTxStatus()
      )),
      toArray()
    )
    .toPromise()
    .then(statuses => {
      const statusCheck = statuses.some(s => requiredStatuses.includes(s))
      if (statusCheck) {
        return Promise.resolve()
      }

      return Promise.reject(
        new Error(`Command response error: expected=${requiredStatuses}, actual=${statuses}`)
      )
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

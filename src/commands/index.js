import txHelper from '../txHelper'
import { TxStatus, TxStatusRequest } from '../proto/endpoint_pb'
import { getProtoEnumName } from '../util'

const DEFAULT_TIMEOUT_LIMIT = 5000
const DEFAULT_OPTIONS = {
  privateKeys: [''],
  creatorAccountId: '',
  quorum: 1,
  commandService: null
}

function command (
  {
    privateKeys,
    creatorAccountId,
    quorum,
    commandService
  } = DEFAULT_OPTIONS,
  tx,
  timeoutLimit = DEFAULT_TIMEOUT_LIMIT
) {
  let txToSend = txHelper.addMeta(tx, {
    creatorAccountId,
    quorum
  })

  txToSend = signWithArrayOfKeys(txToSend, privateKeys)

  let txClient = commandService

  return sendTransactions([txToSend], txClient, timeoutLimit)
}

function sendTransactions (txs, txClient, timeoutLimit, requiredStatuses = [
  'MST_PENDING',
  'COMMITTED'
]) {
  const hashes = txs.map(x => txHelper.hash(x))
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

      resolve()
    })
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        // Status requests promises
        let requests = hashes.map(hash => new Promise((resolve, reject) => {
          let statuses = []

          let request = new TxStatusRequest()
          request.setTxHash(hash.toString('hex'))

          let stream = txClient.statusStream(request)
          stream.on('data', function (response) {
            statuses.push(response)
          })

          stream.on('end', function (end) {
            statuses.length > 0 ? resolve(statuses[statuses.length - 1].getTxStatus()) : resolve(null)
          })
        }))

        Promise.all(requests)
          .then(values => {
            let statuses = values.map(x => x !== null ? getProtoEnumName(
              TxStatus,
              'iroha.protocol.TxStatus',
              x
            ) : null)
            statuses.some(x => requiredStatuses.includes(x))
              ? resolve()
              : reject(
                new Error(`Your transaction wasn't commited: expected: ${requiredStatuses}, actual=${statuses}`)
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

function addAssetQuantity (commandOptions, { assetId, amount }) {}

function addPeer (commandOptions, { address, peerKey }) {}

function addSignatory (commandOptions, { accountId, publicKey }) {}

function appendRole (commandOptions, { accountId, roleName }) {}

function createAccount (commandOptions, { accountName, domainId, publicKey }) {
  return command(
    commandOptions,
    txHelper.addCommand(
      txHelper.emptyTransaction(),
      'createAccount',
      {
        accountName,
        domainId,
        publicKey
      }
    )
  )
}

function createAsset (commandOptions, { assetName, domainId, precision }) {}

function createDomain (commandOptions, { domainId, defaultRole }) {}

function createRole (commandOptions, { roleName, rolePermission }) {}

function detachRole (commandOptions, { accountId, roleName }) {}

function grandPermission (commandOptions, { accountId, grantablePermissionName }) {}

function removeSignatory (commandOptions, { accountId, publicKey }) {}

function revokePermission (commandOptions, { accountId, grantablePermissionName }) {}

function setAccountDetail (commandOptions, { accountId, key, value }) {
  return command(
    commandOptions,
    txHelper.addCommand(
      txHelper.emptyTransaction(),
      'setAccountDetail',
      {
        accountId,
        key,
        value
      }
    )
  )
}

function setAccountQuorum (commandOptions, { accountId, quorum }) {}

function substractAssetQuantity (commandOptions, { assetId, amount }) {}

function transferAsset (commandOptions, { fromAccountId, toAccountId, assetId, description, amount }) {}

export default {
  addAssetQuantity,
  addPeer,
  addSignatory,
  appendRole,
  createAccount,
  createAsset,
  createDomain,
  createRole,
  detachRole,
  grandPermission,
  removeSignatory,
  revokePermission,
  setAccountDetail,
  setAccountQuorum,
  substractAssetQuantity,
  transferAsset
}

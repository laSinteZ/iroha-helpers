
import flow from 'lodash/fp/flow'
import queryHelper from '../queryHelper'
import * as pbResponse from '../proto/qry_responses_pb'
import { getProtoEnumName } from '../util'

const DEFAULT_TIMEOUT_LIMIT = 5000
const DEFAULT_OPTIONS = {
  privateKey: '',
  creatorAccountId: '',
  queryService: null
}

/**
 * wrapper function of queries
 * @param {Object} query
 * @param {Function} onResponse
 * @param {Number} timeoutLimit
 */
function sendQuery (
  {
    privateKey,
    creatorAccountId,
    queryService
  } = DEFAULT_OPTIONS,
  query,
  onResponse = function (resolve, reject, responseName, response) {},
  timeoutLimit = DEFAULT_TIMEOUT_LIMIT
) {
  return new Promise((resolve, reject) => {
    const queryClient = queryService

    let queryToSend = flow(
      (q) => queryHelper.addMeta(q, { creatorAccountId }),
      (q) => queryHelper.sign(q, privateKey)
    )(query)

    /**
     * grpc-node hangs against unresponsive server, which possibly occur when
     * invalid node IP is set. To avoid this problem, we use timeout timer.
     * c.f. {@link https://github.com/grpc/grpc/issues/13163 Grpc issue 13163}
     */
    const timer = setTimeout(() => {
      queryClient.$channel.close()
      reject(new Error('please check IP address OR your internet connection'))
    }, timeoutLimit)

    queryClient.find(queryToSend, (err, response) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      const type = response.getResponseCase()
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      onResponse(resolve, reject, responseName, response)
    })
  })
}

function getAccount (queryOptions, { accountId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getAccount',
      {
        accountId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ACCOUNT_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_RESPONSE, actual=${responseName}`))
      }

      const account = response.getAccountResponse().getAccount().toObject()
      resolve(account)
    }
  )
}

function getSignatories (queryOptions, { accountId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getSignatories',
      {
        accountId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'SIGNATORIES_RESPONSE') {
        return reject(new Error(`Query response error: expected=SIGNATORIES_RESPONSE, actual=${responseName}`))
      }

      const account = response.getSignatoriesResponse().toObject().keysList
      resolve(account)
    }
  )
}

function getTransactions (queryOptions, { transactionsHashes }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getTransactions',
      {
        transactionsHashes
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsResponse()
      resolve(transactions)
    }
  )
}

function getPendingTransactions (queryOptions) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getPendingTransactions',
      {}
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsResponse().toObject().transactionsList
      resolve(transactions)
    }
  )
}

function getAccountTransactions (queryOptions, { accountId, pageSize, firstTxHash }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getAccountTransactions',
      {
        accountId,
        paginationMeta: {
          pageSize,
          firstTxHash
        }
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_PAGE_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_PAGE_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsPageResponse().toObject()
      resolve(transactions)
    }
  )
}

function getAccountAssetTransactions (queryOptions, { accountId, assetId, pageSize, firstTxHash }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'GetAccountAssetTransactions',
      {
        accountId,
        assetId,
        paginationMeta: {
          pageSize,
          firstTxHash
        }
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_PAGE_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_PAGE_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsPageResponse().toObject()
      resolve(transactions)
    }
  )
}

function getAccountAssets (queryOptions, { accountId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getAccountAssets',
      {
        accountId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ACCOUNT_ASSETS_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_ASSETS_RESPONSE, actual=${responseName}`))
      }

      const assets = response.getAccountAssetsResponse().toObject().accountAssetsList
      resolve(assets)
    }
  )
}

function getAccountDetail (queryOptions, { accountId, key, writerId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getAccountDetail',
      {
        accountId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ACCOUNT_DETAIL_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_DETAIL_RESPONSE, actual=${responseName}`))
      }

      const transactions = JSON.parse(response.getAccountDetailResponse().toObject().detail)
      resolve(transactions)
    }
  )
}

function getAssetInfo (queryOptions, { assetId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getAssetInfo',
      {
        assetId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ASSET_RESPONSE') {
        return reject(new Error(`Query response error: expected=ASSET_RESPONSE, actual=${responseName}`))
      }

      const info = response.getAssetResponse().toObject().asset
      resolve(info)
    }
  )
}

function getRoles (queryOptions) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getRoles',
      {}
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ROLES_RESPONSE') {
        return reject(new Error(`Query response error: expected=ROLES_RESPONSE, actual=${responseName}`))
      }

      const roles = response.getRolesResponse().toObject().rolesList
      resolve(roles)
    }
  )
}

function getRolePermissions (queryOptions, { roleId }) {
  return sendQuery(
    queryOptions,
    queryHelper.addQuery(
      queryHelper.emptyQuery(),
      'getRolePermissions',
      {
        roleId
      }
    ),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ROLE_PERMISSIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=ROLE_PERMISSIONS_RESPONSE, actual=${responseName}`))
      }

      const permissions = response.getRolePermissionsResponse().toObject().permissionsList
      resolve(permissions)
    }
  )
}

export default {
  getAccount,
  getSignatories,
  getTransactions,
  getPendingTransactions,
  getAccountTransactions,
  getAccountAssetTransactions,
  getAccountAssets,
  getAccountDetail,
  getAssetInfo,
  getRoles,
  getRolePermissions
}

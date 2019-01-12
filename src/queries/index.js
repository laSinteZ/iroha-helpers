
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

export default {
  getAccount
}

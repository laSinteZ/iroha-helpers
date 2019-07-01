import isEqual from 'lodash.isequal'
import isPlainObject from 'lodash.isplainobject'

import checks from './checks'

const allowEmpty = [
  'key',
  'writer'
]

const schema = {
  amount: checks.checkAmount,
  precision: checks.checkPresission,
  accountName: checks.checkAccountName,
  accountId: checks.checkAccountId,
  domainId: checks.checkDomain,
  assetId: checks.checkAssetId,
  srcAccountId: checks.checkAccountId,
  destAccountId: checks.checkAccountId,
  description: checks.checkDescription,
  quorum: checks.checkQuorum,
  assetName: checks.checkAssetName,
  roleName: checks.checkRoleName,
  defaultRole: checks.checkRoleName,
  key: checks.checkAccountDetailsKey,
  value: checks.checkAccountDetailsValue,
  roleId: checks.checkRoleName,
  writer: checks.checkAccountId,

  peerKey: checks.toImplement,
  publicKey: checks.toImplement,
  permissionsList: checks.toImplement,
  permission: checks.toImplement,
  txHashesList: checks.toImplement,
  address: checks.toImplement,
  pageSize: checks.toImplement,
  firstTxHash: checks.toImplement,
  height: checks.toImplement
}

const compare = (a, b) => a - b

function validateParams (object, required) {
  if (!isPlainObject(object)) {
    throw new Error(
      `Expected type of arguments: object, actual: ${typeof object}`
    )
  }

  const isEquals = isEqual(
    Object.keys(object).sort(compare),
    required.sort(compare)
  )

  if (!isEquals) {
    throw new Error(
      `Expected arguments: ${required}, actual: ${Object.keys(object)}`
    )
  }

  const errors = required
    .map(property => {
      const validator = schema[property]

      // TODO: Create better way to handle not required arguments
      if (allowEmpty.includes(property)) {
        return [
          property,
          { isValid: true }
        ]
      }

      return [property, validator(object[property])]
    })
    .reduce((errors, pair) => {
      if (pair[1].isValid === false) {
        errors.push(
          new Error(
            `Field "${pair[0]}" (value: "${object[pair[0]]}") is incorrect\nReason: ${pair[1].reason}`
          )
        )
      }
      return errors
    }, [])

  if (errors.length) {
    throw errors
  }

  return object
}

export default validateParams

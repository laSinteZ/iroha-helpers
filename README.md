
[![npm version](https://badge.fury.io/js/iroha-helpers.svg)](https://www.npmjs.com/package/iroha-helpers) [![Iroha 1.0.0-rc2](https://img.shields.io/badge/Iroha-1.0.0--rc2-red.svg)](https://github.com/hyperledger/iroha/releases/tag/1.0.0_rc2)

# iroha-helpers

Some functions which will help you to interact with [Hyperledger Iroha](https://github.com/hyperledger/iroha) from your JS program

## Trying an example

 1. Clone this repository
 2. Run Iroha http://iroha.readthedocs.io/en/latest/getting_started/
 3. Run `grpc-web-proxy` for iroha https://gitlab.com/snippets/1713665
 4. `yarn build && node example`

## Commands
- [x] [addAssetQuantity](https://iroha.readthedocs.io/en/latest/api/commands.html#add-asset-quantity)
- [x] [addPeer](https://iroha.readthedocs.io/en/latest/api/commands.html#add-peer)
- [x] [addSignatory](https://iroha.readthedocs.io/en/latest/api/commands.html#add-signatory)
- [x] [appendRole](https://iroha.readthedocs.io/en/latest/api/commands.html#append-role)
- [x] [createAccount](https://iroha.readthedocs.io/en/latest/api/commands.html#create-account)
- [x] [createAsset](https://iroha.readthedocs.io/en/latest/api/commands.html#create-asset)
- [x] [createDomain](https://iroha.readthedocs.io/en/latest/api/commands.html#create-domain)
- [x] [createRole](https://iroha.readthedocs.io/en/latest/api/commands.html#create-role)
- [x] [detachRole](https://iroha.readthedocs.io/en/latest/api/commands.html#detach-role)
- [x] [grandPermission](https://iroha.readthedocs.io/en/latest/api/commands.html#grant-permission)
- [x] [removeSignatory](https://iroha.readthedocs.io/en/latest/api/commands.html#remove-signatory)
- [x] [revokePermission](https://iroha.readthedocs.io/en/latest/api/commands.html#revoke-permission)
- [x] [setAccountDetail](https://iroha.readthedocs.io/en/latest/api/commands.html#set-account-detail)
- [x] [setAccountQuorum](https://iroha.readthedocs.io/en/latest/api/commands.html#set-account-quorum)
- [x] [substractAssetQuantity](https://iroha.readthedocs.io/en/latest/api/commands.html#subtract-asset-quantity)
- [x] [transferAsset](https://iroha.readthedocs.io/en/latest/api/commands.html#transfer-asset)

## Queries
- [x] [getAccount](https://iroha.readthedocs.io/en/latest/api/queries.html#get-account)
- [x] [getSignatories](https://iroha.readthedocs.io/en/latest/api/queries.html#get-signatories)
- [x] [getTransactions](https://iroha.readthedocs.io/en/latest/api/queries.html#get-transactions)
- [x] [getPendingTransactions](https://iroha.readthedocs.io/en/latest/api/queries.html#get-pending-transactions)
- [x] [getAccountTransactions](https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-transactions)
- [x] [getAccountAssetTransactions](https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-asset-transactions)
- [x] [getAccountAssets](https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-assets)
- [x] [getAccountDetail](https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-detail)
- [x] [getAssetInfo](https://iroha.readthedocs.io/en/latest/api/queries.html#get-asset-info)
- [x] [getRoles](https://iroha.readthedocs.io/en/latest/api/queries.html#get-roles)
- [x] [getRolePermissions](https://iroha.readthedocs.io/en/latest/api/queries.html#get-role-permissions)

## Known issues
 - Please be careful: API might and WILL change.

## TODO
 - [ ] Field validation
 - [ ] Add tests
 - [ ] Integration tests with Iroha
 - [ ] Add more documentation
 - [ ] Minify/Uglify

import * as Transaction from './proto/transaction_pb'
import txHelper from './txHelper'
import validate from './validate'
import {
  AddSignatory,
  TransferAsset,
  AddAssetQuantity,
  CreateAsset,
  RemoveSignatory,
  SetAccountQuorum,
  DetachRole,
  GrantPermission,
  RevokePermission,
  AddPeer,
  CreateAccount,
  SetAccountDetail,
  CreateDomain,
  AppendRole,
  CreateRole,
  SubtractAssetQuantity
} from '../lib/proto/commands_pb';

export default class TxBuilder {
  constructor (
    public tx = new Transaction.Transaction()
    ) {
    }

  addAssetQuantity (params: AddAssetQuantity.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addAssetQuantity',
        validate(params, ['assetId', 'amount'])
      )
    )
  }

  addPeer (params: AddPeer.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addPeer',
        validate(params, ['address', 'peerKey'])
      )
    )
  }

  addSignatory (params: AddSignatory.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addSignatory',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  createAsset (params: CreateAsset.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createAsset',
        validate(params, ['assetName', 'domainId', 'precision'])
      )
    )
  }

  createAccount (params: CreateAccount.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createAccount',
        validate(params, ['accountName', 'domainId', 'publicKey'])
      )
    )
  }

  setAccountDetail (params: SetAccountDetail.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'setAccountDetail',
        validate(params, ['accountId', 'key', 'value'])
      )
    )
  }

  createDomain (params: CreateDomain.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createDomain',
        validate(params, ['domainId', 'defaultRole'])
      )
    )
  }

  removeSignatory (params: RemoveSignatory.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'removeSignatory',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  setAccountQuorum (params: SetAccountQuorum.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'setAccountQuorum',
        validate(params, ['accountId', 'quorum'])
      )
    )
  }

  transferAsset (params: TransferAsset.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'transferAsset',
        validate(params, ['srcAccountId', 'destAccountId', 'assetId', 'description', 'amount'])
      )
    )
  }

  appendRole (params: AppendRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'appendRole',
        validate(params, ['accountId', 'roleName'])
      )
    )
  }

  detachRole (params: DetachRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'detachRole',
        validate(params, ['accountId', 'roleName'])
      )
    )
  }

  createRole (params: CreateRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createRole',
        validate(params, ['roleName', 'permissionsList'])
      )
    )
  }

  grantPermission (params: GrantPermission.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'grantPermission',
        validate(params, ['accountId', 'permission'])
      )
    )
  }

  revokePermission (params: RevokePermission.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'revokePermission',
        validate(params, ['accountId', 'permission'])
      )
    )
  }

  subtractAssetQuantity (params: SubtractAssetQuantity.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'subtractAssetQuantity',
        validate(params, ['assetId', 'amount'])
      )
    )
  }

  addMeta (creatorAccountId: string, quorum: number) {
    return new TxBuilder(
      txHelper.addMeta(this.tx, { creatorAccountId, quorum })
    )
  }

  sign (privateKeys) {
    return new TxBuilder(
      privateKeys.reduce((tx, key) => txHelper.sign(tx, key), this.tx)
    )
  }

  send () {
    return this.tx
  }
}

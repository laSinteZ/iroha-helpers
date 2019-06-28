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

  cmdAddAssetQuantity (params: AddAssetQuantity.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addAssetQuantity',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdAddPeer (params: AddPeer.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addPeer',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdAddSignatory (params: AddSignatory.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'addSignatory',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdCreateAsset (params: CreateAsset.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createAsset',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdCreateAccount (params: CreateAccount.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createAccount',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdSetAccountDetail (params: SetAccountDetail.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'setAccountDetail',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdCreateDomain (params: CreateDomain.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createDomain',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdRemoveSignatory (params: RemoveSignatory.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'removeSignatory',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdSetAccountQuorum (params: SetAccountQuorum.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'setAccountQuorum',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdTransferAsset (params: TransferAsset.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'transferAsset',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdAppendRole (params: AppendRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'appendRole',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdDetachRole (params: DetachRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'detachRole',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdCreateRole (params: CreateRole.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'createRole',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdGrantPermission (params: GrantPermission.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'grantPermission',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdRevokePermission (params: RevokePermission.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'revokePermission',
        validate(params, ['accountId', 'publicKey'])
      )
    )
  }

  cmdSubtractAssetQuantity (params: SubtractAssetQuantity.AsObject) {
    return new TxBuilder(
      txHelper.addCommand(
        this.tx,
        'subtractAssetQuantity',
        validate(params, ['accountId', 'publicKey'])
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

import * as Transaction from './proto/transaction_pb'
import txHelper from './txHelper'
import validate from './validate'
import { AddSignatory, TransferAsset } from './proto/commands_pb';

export default class TxBuilder {
  constructor (
    public tx = new Transaction.Transaction()
    ) {
    }
    
  addCommand(commandName: 'addSignatory', params: AddSignatory.AsObject);
  addCommand(commandName: 'transferAsset', params: TransferAsset.AsObject);
  addCommand (commandName, params) {
      return new TxBuilder(
      txHelper.addCommand(this.tx, commandName, params)
    )
  }

  cmdAddSignatory (params: AddSignatory.AsObject) {
    const v = <T>(params: T, keys: (keyof T)[]) => null
    v(params, ['accountId', 'publicKey'])
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

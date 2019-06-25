// for usage with grpc package use endpoint_grpc_pb file
import * as grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from '../lib/proto/endpoint_grpc_pb'

import * as flow from 'lodash.flow'

import txHelper from '../lib/txHelper'

import commands from '../lib/commands'
import queries from '../lib/queries'
import TxChain from '../lib/chain';

const IROHA_ADDRESS = 'localhost:50051'

let adminPriv =
  'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'

const commandService = new CommandService_v1Client(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

const queryService = new QueryService_v1Client(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

const tx = new TxChain()
  .createTransactions()
  .addCommand('addAssetQuantity', { assetId: 'a#a', amount: '1' })
  .addCommand('addSignatory', {
    accountId: 'd3@d3',
    publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
  })
  .addMeta('test@d3', 2)
  .sing(['f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'])
  .send()

console.log(tx.toObject().payload.reducedPayload.commandsList)

// const a = (name: string, params: Object, tx = txHelper.emptyTransaction()) => txHelper.addCommand(
//   tx,
//   name,
//   params
// )

// console.log(
//   a('addAssetQuantity', { assetId: 'a#a', amount: '1' })()
// )

// flow([
//   () => a('addAssetQuantity', { assetId: 'a#a', amount: '1' }),
//   (res) => a('addSignatory', {
//     accountId: 'd3@d3',
//     publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
//   }, res),
//   (res) => console.log(res.toObject().payload.reducedPayload)
// ])()

// queries.fetchCommits(
//   {
//     privateKey: adminPriv,
//     creatorAccountId: 'admin@test',
//     queryService
//   },
//   (block) => console.log('fetchCommits new block:', block),
//   (error) => console.error('fetchCommits failed:', error.stack)
// )
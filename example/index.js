"use strict";
exports.__esModule = true;
// for usage with grpc package use endpoint_grpc_pb file
var grpc = require("grpc");
var endpoint_grpc_pb_1 = require("../lib/proto/endpoint_grpc_pb");
var chain_1 = require("../lib/chain");
var IROHA_ADDRESS = 'localhost:50051';
var adminPriv = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
var commandService = new endpoint_grpc_pb_1.CommandService_v1Client(IROHA_ADDRESS, grpc.credentials.createInsecure());
var queryService = new endpoint_grpc_pb_1.QueryService_v1Client(IROHA_ADDRESS, grpc.credentials.createInsecure());
var tx = new chain_1["default"]()
    .createTransactions()
    .addCommand('addAssetQuantity', { assetId: 'a#a', amount: '1' })
    .addCommand('addSignatory', {
    accountId: 'd3@d3',
    publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
})
    .addMeta('test@d3', 2)
    .sing(['f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'])
    .send();
console.log(tx.toObject().payload.reducedPayload.commandsList);
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

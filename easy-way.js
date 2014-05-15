// var bitcoin = require("bitcoinjs-lib")
// var helloblock = require('helloblock-js')({
//   network: 'testnet'
// })

var helloblock = new HelloBlock({
  network: 'testnet'
})

var addressVersion = bitcoin.network.testnet.addressVersion

var privateKey = "cND8kTK2zSJf1bTqaz5nZ2Pdqtv43kQNcwJ1Dp5XWtbRokJNS97N"
var ecKey = new bitcoin.ECKey(privateKey)
var ecKeyAddress = ecKey.getAddress(addressVersion).toString()
var toAddress = 'mzPkw5EdvHCntC2hrhRXSqwHLHpLWzSZiL'

var txFee = 10000
var txTargetValue = 200000

helloblock.addresses.getUnspents(ecKeyAddress, {
  value: txTargetValue + txFee
}, function(err, res, unspents) {
  if (err) throw new Error(err)

  var tx = new bitcoin.Transaction()

  var totalUnspentsValue = 0
  unspents.forEach(function(unspent) {
    tx.addInput(unspent.txHash, unspent.index)
    totalUnspentsValue += unspent.value
  })

  tx.addOutput(toAddress, txTargetValue)

  var txChangeValue = totalUnspentsValue - txTargetValue - txFee
  tx.addOutput(ecKeyAddress, txChangeValue)

  tx.sign(0, ecKey)

  var rawTxHex = tx.serializeHex()

  helloblock.transactions.propagate(rawTxHex, function(err, res, tx) {
    if (err) throw new Error(err)

    console.log('https://test.helloblock.io/transactions/' + tx.txHash)
  })
})

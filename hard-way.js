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
}, function(err, response, unspents) {
  if (err) throw new Error(err)

  var tx = new bitcoin.Transaction()

  var totalUnspentsValue = 0

  // INPUTS
  // HelloBlock selects the optimal unspent outputs above using 'value'
  // Now, we add all unspent outputs as an input in this transaction
  unspents.forEach(function(unspent) {
    var input = new bitcoin.TransactionIn({
      sequence: [255, 255, 255, 255],
      outpoint: {
        hash: unspent.txHash,
        index: unspent.index
      }
    })

    tx.ins.push(input)

    totalUnspentsValue += unspent.value
  })

  // OUTPUTS
  // Output 1: Send value to recipient
  var recipientScript = new bitcoin.Script()
  var toAddressObj = new bitcoin.Address(toAddress, addressVersion)

  recipientScript.writeOp(bitcoin.Opcode.map.OP_DUP)
  recipientScript.writeOp(bitcoin.Opcode.map.OP_HASH160)
  recipientScript.writeBytes(toAddressObj.hash)
  recipientScript.writeOp(bitcoin.Opcode.map.OP_EQUALVERIFY)
  recipientScript.writeOp(bitcoin.Opcode.map.OP_CHECKSIG)

  var recipientOutput = new bitcoin.TransactionOut({
    value: txTargetValue,
    script: recipientScript
  })

  tx.outs.push(recipientOutput)

  // Output 2: Send change back to self
  var changeScript = new bitcoin.Script()
  var changeValue = totalUnspentsValue - txTargetValue - txFee

  changeScript.writeOp(bitcoin.Opcode.map.OP_DUP)
  changeScript.writeOp(bitcoin.Opcode.map.OP_HASH160)
  changeScript.writeBytes(ecKey.getAddress(addressVersion).hash)
  changeScript.writeOp(bitcoin.Opcode.map.OP_EQUALVERIFY)
  changeScript.writeOp(bitcoin.Opcode.map.OP_CHECKSIG)

  var changeOutput = new bitcoin.TransactionOut({
    value: changeValue,
    script: changeScript
  })

  tx.outs.push(changeOutput)

  // SIGNING
  var sigHashAll = 1
  var ecKeyPub = ecKey.getPub().toBytes()
  tx.ins.forEach(function(input, index) {
    var connectedScript = bitcoin.Script.fromHex(unspents[index].scriptPubKey)

    var txSigHash = tx.hashTransactionForSignature(connectedScript, index, sigHashAll)
    var signature = ecKey.sign(txSigHash).concat([sigHashAll])

    var inputScript = new bitcoin.Script()
    inputScript.writeBytes(signature)
    inputScript.writeBytes(ecKeyPub)

    input.script = inputScript
  })

  var rawTxHex = tx.serializeHex()

  helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
    if (err) throw new Error(err)

    console.log('https://test.helloblock.io/transactions/' + resource.txHash)
  })
})

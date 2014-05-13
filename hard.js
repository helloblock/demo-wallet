var bitcoin = require("bitcoinjs-lib")
var Script = bitcoin.Script
var Transaction = bitcoin.Transaction
var TransactionIn = bitcoin.TransactionIn
var TransactionOut = bitcoin.TransactionOut
var Opcode = bitcoin.Opcode
var Address = bitcoin.Address
var ECKey = bitcoin.ECKey
var network = bitcoin.network

var helloblock = require('helloblock-js')({
    network: 'testnet'
});

var privateKey = "cND8kTK2zSJf1bTqaz5nZ2Pdqtv43kQNcwJ1Dp5XWtbRokJNS97N"
var key = new ECKey(privateKey);
var addressVersion = network.testnet.addressVersion
var fromAddress = key.getAddress(addressVersion).toString();
var toAddress = 'mzPkw5EdvHCntC2hrhRXSqwHLHpLWzSZiL'

var fee = 10000
var targetValue = 200000

helloblock.addresses.getUnspents(fromAddress, {
    value: targetValue + fee
}, function(err, response, resource) {
    if (err) throw new Error(err);

    var unspents = resource;
    var totalUnspentsValue = 0;

    var tx = new Transaction()

    // INPUTS
    unspents.forEach(function(unspent) {
        var input = new TransactionIn({
            sequence: [255, 255, 255, 255],
            outpoint: {
                hash: unspent.txHash,
                index: unspent.index
            },
            script: undefined
        })

        tx.ins.push(input)

        totalUnspentsValue += unspent.value
    })

    // OUTPUTS
    var scriptRecipient = new Script()
    scriptRecipient.writeOp(Opcode.map.OP_DUP)
    scriptRecipient.writeOp(Opcode.map.OP_HASH160)
    var toAddressObj = new Address(toAddress, addressVersion)
    scriptRecipient.writeBytes(toAddressObj.hash)
    scriptRecipient.writeOp(Opcode.map.OP_EQUALVERIFY)
    scriptRecipient.writeOp(Opcode.map.OP_CHECKSIG)

    var outputRecipient = new TransactionOut({
        value: targetValue,
        script: scriptRecipient
    })

    tx.outs.push(outputRecipient)

    var changeValue = totalUnspentsValue - targetValue - fee

    var scriptChange = new Script()
    scriptChange.writeOp(Opcode.map.OP_DUP)
    scriptChange.writeOp(Opcode.map.OP_HASH160)
    scriptChange.writeBytes(key.getAddress(addressVersion).hash)
    scriptChange.writeOp(Opcode.map.OP_EQUALVERIFY)
    scriptChange.writeOp(Opcode.map.OP_CHECKSIG)

    var outputChange = new TransactionOut({
        value: changeValue,
        script: scriptChange
    })

    tx.outs.push(outputChange)

    // SIGNING
    var SIGHASH_ALL = 1
    var pubkey = key.getPub().toBytes()
    tx.ins.forEach(function(input, index) {
        var previousScript = Script.fromHex(unspents[index].scriptPubKey)

        var hash = tx.hashTransactionForSignature(previousScript, index, SIGHASH_ALL)
        var signature = key.sign(hash).concat([SIGHASH_ALL])

        var inputScript = new Script()
        inputScript.writeBytes(signature)
        inputScript.writeBytes(pubkey)

        input.script = inputScript
    })

    var rawTxHex = tx.serializeHex();

    console.log(rawTxHex)

    helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
        if (err) throw new Error(err);

        console.log('https://test.helloblock.io/transactions/' + resource.txHash)
    })
})

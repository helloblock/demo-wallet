var bitcoin = require("bitcoinjs-lib")
var helloblock = require('helloblock-js')({
    network: 'testnet'
});

var privateKey = "cMiDoTUNgW3KBzW5pbP9TPe1ULxBai46kU8P9ZTpYbMMqg4Zh2Ww"
var key = new bitcoin.ECKey(privateKey);
var addressVersion = bitcoin.network.testnet.addressVersion
var fromAddress = key.getAddress(addressVersion).toString();
var toAddress = 'mzPkw5EdvHCntC2hrhRXSqwHLHpLWzSZiL'

var targetValue = 200000
var fee = 10000

helloblock.addresses.getUnspents(fromAddress, {
    value: targetValue + fee
}, function(err, response, resource) {
    if (err) throw new Error(err);

    var unspents = resource;
    var tx = new bitcoin.Transaction()

    // INPUTS
    unspents.forEach(function(unspent) {
        var input = new bitcoin.TransactionIn({
            sequence: 0xffffffff,
            outpoint: {
                hash: unspent.txHash,
                index: unspent.index
            },
            script: undefined
        })

        tx.ins.push(input)

    })

    // OUTPUTS
    var scriptRecipient = new Script()
    scriptRecipient.writeOp(Opcode.map.OP_DUP)
    scriptRecipient.writeOp(Opcode.map.OP_HASH160)
    var toAddressObj = new Address(toAddress, addressVersion)
    scriptRecipient.writeBytes(toAddressObj.hash)
    scriptRecipient.writeOp(Opcode.map.OP_EQUALVERIFY)
    scriptRecipient.writeOp(Opcode.map.OP_CHECKSIG)

    var outputRecipient = new bitcoin.TransactionOut({
        value: targetValue,
        script: scriptRecipient
    })

    var changeValue = unspent.value - targetValue - fee

    var scriptChange = new Script()
    scriptChange.writeOp(Opcode.map.OP_DUP)
    scriptChange.writeOp(Opcode.map.OP_HASH160)
    scriptChange.writeBytes(key.getAddress(addressVersion).hash)
    scriptChange.writeOp(Opcode.map.OP_EQUALVERIFY)
    scriptChange.writeOp(Opcode.map.OP_CHECKSIG)

    var outputRecipient = new bitcoin.TransactionOut({
        value: changeValue,
        script: scriptChange
    })

    // SIGNING
    var SIGHASH_ALL = 1
    var pubkey = key.getPub().toBytes()
    var keyHash160 = util.sha256ripe160(pubkey)
    txs.ins.forEach(function(input, index) {
        var previousScript = new Script()
        previousScript.writeOp(Opcode.map.OP_DUP)
        previousScript.writeOp(Opcode.map.OP_HASH160)
        previousScript.writeBytes(keyHash160)
        previousScript.writeOp(Opcode.map.OP_EQUALVERIFY)
        previousScript.writeOp(Opcode.map.OP_CHECKSIG)

        var hash = tx.hashTransactionForSignature(previousScript, index, SIGHASH_ALL)
        var signature = key.sign(hash).concat([type])

        var inputScript = new Script()
        inputScript.writeBytes(signature)
        inputScript.writeBytes(pubkey)

        input.script = inputScript
    })

    var rawTxHex = tx.serializeHex();

    helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
        if (err) throw new Error(err);

        console.log('https://test.helloblock.io/transactions/' + resource.txHash)
    })
})

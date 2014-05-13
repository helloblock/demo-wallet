var bitcoin = require("bitcoinjs-lib")
var helloblock = require('helloblock-js')({
    network: 'testnet'
});

var privateKey = "cMiDoTUNgW3KBzW5pbP9TPe1ULxBai46kU8P9ZTpYbMMqg4Zh2Ww"
var key = new bitcoin.ECKey(privateKey);
var addressVersion = bitcoin.network.testnet.addressVersion
var fromAddress = key.getAddress(addressVersion).toString();
var toAddress = 'mzPkw5EdvHCntC2hrhRXSqwHLHpLWzSZiL'

var fee = 10000
var targetValue = 20000

helloblock.addresses.getUnspents(fromAddress, {
    value: targetValue + fee
}, function(err, response, resource) {
    if (err) throw new Error(err);

    var unspents = resource;
    var tx = new bitcoin.Transaction()

    unspents.forEach(function(unspent) {
        tx.addInput(unspent.txHash, unspent.index)
    })

    tx.addOutput(toAddress, targetValue)

    var changeValue = unspent.value - targetValue - fee
    tx.addOutput(fromAddress, changeValue)

    tx.sign(0, key)

    var rawTxHex = tx.serializeHex();

    helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
        if (err) throw new Error(err);

        console.log('https://test.helloblock.io/transactions/' + resource.txHash)
    })
})

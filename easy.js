var bitcoin = require("bitcoinjs-lib")
var helloblock = require('helloblock-js')({
    network: 'testnet'
});

var privateKey = "cND8kTK2zSJf1bTqaz5nZ2Pdqtv43kQNcwJ1Dp5XWtbRokJNS97N"
var key = new bitcoin.ECKey(privateKey);
var addressVersion = bitcoin.network.testnet.addressVersion
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

    var tx = new bitcoin.Transaction()

    unspents.forEach(function(unspent) {
        tx.addInput(unspent.txHash, unspent.index)
        totalUnspentsValue += unspent.value
    })

    tx.addOutput(toAddress, targetValue)

    var changeValue = totalUnspentsValue - targetValue - fee
    tx.addOutput(fromAddress, changeValue)

    tx.sign(0, key)

    var rawTxHex = tx.serializeHex();

    console.log(rawTxHex)

    // helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
    //     if (err) throw new Error(err);

    //     console.log('https://test.helloblock.io/transactions/' + resource.txHash)
    // })
})

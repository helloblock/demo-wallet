console.log('test')
var helloblock = require('helloblock-js')({
  network: 'testnet',
  debug: true
});
var bitcoin = require('bitcoinjs-lib');

// Step 1: Generate addresses
// See this article for how to generate addresses. The difference between mainnet address and testnet address is the version bytes.
// So let's supply it with testnet version bytes
var key = new bitcoin.ECKey();
var testnetAddress = key.getPub().getAddress(bitcoin.network.testnet.addressVersion).toString();

// Step 2: Let's withdraw some testnet coin from the faucet
helloblock.faucet.withdraw(testnetAddress, 10000, function(err) {
  if (err) return console.error(err);

  // Step 3: Let's begin constructing a transaction
  // Step 3a: Get the previous unspent outputs
  helloblock.addresses.getUnspents(testnetAddress, function(err, response, resource) {
    if (err) return next(err);

    var unspent = resource[0];

    /*
      Complex Version:
        1. What is unspent output and why do you need it?
    */

    // {
    //   confirmations: 0,
    //   blockHeight: null,
    //   txHash: 'e4baa5d021828c89216bfbd43748a57d38c257af8fc389e93c0b6fcf49833d3f',
    //   index: 0,
    //   scriptPubKey: '76a914a3227fa02eb15aea51b5b2fad8b647ada6602ad788ac',
    //   type: 'pubkeyhash',
    //   value: 10000,
    //   hash160: 'a3227fa02eb15aea51b5b2fad8b647ada6602ad7',
    //   address: 'mvPXmKgDGSTuYBLu7pUx55q9Bq7TNsUqeW' 
    // }

    var tx = new bitcoin.Transaction()

    // Step 3b: addInput
    tx.addInput(unspent.txHash, unspent.index)
    /*
     Complex version:
        1. prevout hash
        2. prevout output index
        3. locktime
    */

    // Step 3c: addOutputs
    tx.addOutput('mzPkw5EdvHCntC2hrhRXSqwHLHpLWzSZiL', 8000)
    /*
      Complex version: 
        1. value
        2. Script pubkey (how do you generate a script pubkey)
    */

    // Once the transaction has been constructued fully, Let's now sign it
    // Step 3d: sign - input 0
    tx.sign(0, key)
    /*
      Complex version:
        1. Take the connected script from the prev output
        2. Blank out all the other scriptsigs
        3. Insert the connected script into the scriptsig - one that you are signing
        4. Append hash type (introduce the 4 hash types)
        5. Sign and then sha256.x2
        6. This generates the signatures and then append the pubkey onto it (why do you do that? explain the stack)
    */

    // Step 3e: serialize
    var rawTxHex = tx.serializeHex();
    /*
      Complex version:
        1. Show a table of the bytes  
    */

    // Step 4: Propagate this hex and Check it out
    helloblock.transactions.propagate(rawTxHex, function(err, response, resource) {
      if (err) return console.error(err);
      console.log('https://test.helloblock.io/transactions/' + resource.txHash)
    })
  })
})
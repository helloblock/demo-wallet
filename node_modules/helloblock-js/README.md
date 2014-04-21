[![NodeJS Runtime](https://circleci.com/gh/helloblock/helloblock-js.png?circle-token=a5ed26a1db80f4937ed2b118e6a460b96054e9cf)](https://circleci.com/gh/helloblock/helloblock-js.png?circle-token=a5ed26a1db80f4937ed2b118e6a460b96054e9cf)

[![Browser Runtime](https://ci.testling.com/helloblock/helloblock-js.png)](https://ci.testling.com/helloblock/helloblock-js.png)
### HelloBlock-js

Javascript Client Wrappers for the [HelloBlock API][API].

## Installation:

This module is published in NPM:

```bash
$ npm install helloblock-js --save
```

## API documentation

### Instantiating a Client


```js
var helloblock = require("../lib/helloblock")({
  network: 'testnet',
  debug: true
})
```

This generates a new API client. It accepts an options argument which is used to configure the client.

##### options:

- `network` **string** Setting the target network (```mainnet```, ```testnet```)
- `version` **string** Pointing to particular API version (```v1```)
- `debug`   **string** Output debugging information to the console


This options argument can will be an object with the properties specified
above.


### helloblock client

The API calls are generally constructed as `resource` and `action`:

The second last argument is an optional `[options]` argument and the last argument is the callback.

- `err` error object if there is something wrong in the API call or if status code is above 400
- `response` response object contains the full body of the response, including all the required meta-data
```json
{
  "status": "success",
  "data": {
    "transactions": [
       {
        // transaction
       },
       {
        // transaction
       }
       // ...more transactions...
    ]
  }
}
```

- `resource` resource object contains only the actual data of the response
```json
[
   {
    // transaction
   },
   {
    // transaction
   }
   // ...more transactions...
]
```

```js
helloblock.resource.action('data', [options], function (err, response, resource) {
  if (err) {
    throw err;
  }

});
```

The following API resources are exposes in the module:

- [transactions](#helloblocktransactions)
  - [transactions.get(txHash, callback)](#helloblocktransactionsget)
  - [transactions.batchGet(txHashes, callback)](#helloblocktransactionsbatchget)
  - [transactions.latest([options], callback)](#helloblocktransactionslatest)
  - [transactions.propagate(rawTxHex, callback)](#helloblocktransactionspropagate)
- addresses
  - addresses.get(address, callback)
  - addresses.batchGet(addresses, callback)
  - addresses.getTransactions(addresses, [options], callback)
  - addresses.getUnspents(addresses, [options], callback)
- blocks
  - blocks.get(blockId, callback)
  - blocks.latest([options], callback)
- faucet
  - faucet.get(type, callback)
  - faucet.withdraw(toAddress, value, callback)
- wallet
  - wallet.get(addresses, [options], callback)

### helloblock.transactions
#### helloblock.transactions.get

Get a transaction by its [txHash]('https://helloblock.io/docs/ref#transactions-single')

##### Arguments

- `txHash` **string**
- `callback` **function**

```js
helloblock.transactions.get('2542cd64e02d902975dc6e2e97797ceec5a84e8597c80d22a9e2dbd16e748738', function (err, resp, resource) {
  /*
    use the resource
  */
});
```

#### helloblock.transactions.batchGet

Get transactions by an array of [txHashes]('https://helloblock.io/docs/ref#transactions-batch')

##### Arguments

- `txHashes` **Array[String]**
- `callback` **function**

```js
var txHashes = ['2542cd64e02d902975dc6e2e97797ceec5a84e8597c80d22a9e2dbd16e748738', '6f9e9570881e781db8c137c84c111a138e4a022e6b2def5e2a1589a802fe25f3']
helloblock.transactions.getBatch(txHashes, function (err, resp, resource) {
  /*
    use the resource
  */
});
```

#### helloblock.transactions.latest

Get [latest]('https://helloblock.io/docs/ref#transactions-latest') transactions sorted by timestamp

##### Arguments

- `options` **object** (`limit` {integer}, `offset` {integer})
- `callback` **function**

```js
helloblock.transactions.latest({limit: 10, offset: 10}, function (err, resp, resource) {
  /*
    use the resource
  */
});
```

#### helloblock.transactions.propagate

[Propagate]('https://helloblock.io/docs/ref#transactions-post') a raw transaction to the Bitcoin network

##### Arguments

- `rawTxHex` **string**
- `callback` **function**

```js
var rawTxHex = '0100000001ec71e2ceac84....'
helloblock.transactions.latest(rawTxHex, function (err, resp, resource) {
  /*
    use the resource
  */
});
```


## Tests

All tests should be run with [npm](http://npmjs.org):

```bash
$ npm test
```


[API]: https://helloblock.io/docs/ref

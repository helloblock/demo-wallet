var transactions = require('./resources/transactions');
var addresses = require('./resources/addresses');
var blocks = require('./resources/blocks');
var faucet = require('./resources/faucet');
var wallet = require('./resources/wallet');

function createClient(options) {
  var client = {};
  client.options = options;

  client.transactions = new transactions(options)
  client.addresses = new addresses(options)
  client.blocks = new blocks(options)
  client.faucet = new faucet(options)
  client.wallet = new wallet(options)

  return client;
}

module.exports = createClient;
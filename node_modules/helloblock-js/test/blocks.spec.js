var expect = require('chai').expect;
var helloblock = require('../lib/helloblock')({
  network: 'testnet',
  debug: true
})

// Fixtures
var Fixtures = {
  testnet: {
    blockIds: [
      132412,
      13242,
      32412,
    ]
  },
  mainnet: {
    blockIds: [
      132412,
      12412,
      32412,
    ]
  }
}

describe('Blocks', function() {
  it('- get', function(done) {
    var blockId = Fixtures.testnet.blockIds[0];
    helloblock.blocks.get(blockId, function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource.blockHeight).to.equal(blockId);
      done()
    });
  });

  it('- latest', function(done) {
    helloblock.blocks.latest(function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource).to.not.be.empty
      done()
    });
  })

  it('- getTransactions', function(done) {
    helloblock.blocks.getTransactions(Fixtures.testnet.blockIds[0], function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource).to.not.be.empty;
      done()
    })
  });

  // it('should return appropriate errors', function(done) {
  //   var blockId = 999999
  //   HelloBlock.Blocks.retrieve({
  //     blockId: blockId
  //   }, function(error, response) {
  //     expect(error).to.exist;
  //     done()
  //   })

});

// TODO
// Test more errors
// Test params, e.g limit/offset
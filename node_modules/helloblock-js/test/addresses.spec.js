var expect = require('chai').expect;
var helloblock = require("../lib/helloblock")({
  network: 'testnet',
  debug: true
})

// Fixtures
var Fixtures = {
  testnet: {
    addresses: [
      "mpjuaPusdVC5cKvVYCFX94bJX1SNUY8EJo",
      "mvaRDyLUeF4CP7Lu9umbU3FxehyC5nUz3L",
      "mjkrZkGsM8XjqbH5Gvg7knMPEb5UBLCTDL",
    ]
  },
  mainnet: {
    addresses: [
      "168vRbBhSSQdQnyHH4ZUW8K3B65QjUQ4xJ",
      "16ps38WzmDhEWMPQecVndrWZADekC4FU42",
      "1FRzSRgPffe5A7F4ySgpeQzEDahDp1EtQx",
    ]
  }
}
describe("Addresses", function() {
  it("- get", function(done) {
    var address = Fixtures.testnet.addresses[0];
    helloblock.addresses.get(address, function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource.address).to.equal(address);
      done()
    });
  });

  it("- getTransactions", function(done) {
    helloblock.addresses.getTransactions(Fixtures.testnet.addresses, function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource).to.not.be.empty;
      done()
    })
  });

  it("- getTransactions (limit & offset)", function(done) {
    var addrs = Fixtures.testnet.addresses
    helloblock.addresses.getTransactions(addrs, {
      limit: 100
    }, function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource).to.not.be.empty;
      expect(resource.length).to.equal(100);

      var last = resource[99];
      helloblock.addresses.getTransactions(addrs, {
        limit: 5,
        offset: 99
      }, function(err, resp, resource) {
        expect(err).to.equal(null);
        expect(last.txHash).to.equal(resource[0].txHash);
        done()
      })

    })
  });

  it("- getUnspents", function(done) {
    helloblock.addresses.getUnspents(Fixtures.testnet.addresses, function(err, resp, resource) {
      expect(err).to.equal(null);
      expect(resource).to.not.be.empty;
      done()
    });
  });

  it("should return appropriate errors", function(done) {
    // var address = Fixtures.testnet.addresses[0] + "adsf";
    // helloblock.addresses.retrieve({
    //   address: address
    // }, function(error, response) {
    //   expect(error).to.exist;
    //   done()
    // })
    done()
  });

  // TODO
  // Test more errors
  // Test params, e.g limit/offset
});
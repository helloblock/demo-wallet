var expect = require("chai").expect;
var helloblock = require("../lib/helloblock")({
  network: 'testnet',
  debug: true
})
describe("Faucet", function() {
  it("- get (random key with unspent outputs)", function(done) {
    helloblock.faucet.get(1, function(err, response, resource) {
      expect(err).to.equal(null);
      expect(resource.address).to.exist;
      expect(resource.privateKeyWIF).to.exist;
      expect(resource.unspents).to.not.be.empty;
      done()
    });
  });

  it("- withdraw", function(done) {
    helloblock.faucet.withdraw("mpjuaPusdVC5cKvVYCFX94bJX1SNUY8EJo", 10000, function(err, response, resource) {
      expect(err).to.equal(null);
      expect(resource.txHash).to.exist
      expect(resource.toAddress).to.equal("mpjuaPusdVC5cKvVYCFX94bJX1SNUY8EJo")
      expect(resource.value).to.equal(10000)
      done()
    });
  });
});
var crypt = require('../main');
var assert = require('assert');
var path = require('path');

var vaultFile = path.resolve(__dirname, '..', 'vault.json');

before(function() {
  // set test password
  process.env.VAULT_PASS = 'password';
});

describe('tests', function() {

  it('should encrypt a string', function() {
    var plainText = 'hello';
    var cipherText = crypt.encrypt(plainText);
    assert.notEqual(plainText, cipherText);
  });

  it('should decrypt a string', function() {
    var plainText = 'hello';
    var cipherText = crypt.encrypt(plainText);
    var decipherText = crypt.decrypt(cipherText);
    assert.notEqual(plainText, cipherText);
    assert.equal(plainText, decipherText);
  });

  it('should store an encrypted string and then retrieve it', function(done) {
    var plainText = 'hello';
    var key = 'greeting';

    crypt.put(key, plainText, function(err) {
      if (err) return done(err);

      // verify vault exists and stored the ciphertext
      // associated with the key
      var vault = require(vaultFile);
      assert(vault[key]);

      // should be encrypted
      assert.notEqual(vault[key], plainText);

      // should be able to decrypt
      crypt.get(key, function(err, decipherText) {
        assert.equal(decipherText, plainText);
        done();
      });

    });
  });

});


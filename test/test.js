var vault = require('../lib/vault');
var assert = require('assert');
var fs = require('fs');

var password = 'secret';

before(function() {
  // set test password
  process.env.VAULT_PASS = password;
});

describe('tests', function() {

  it('should encrypt a string', function() {
    var plainText = 'hello';
    var cipherText = vault.encrypt(plainText, password);
    assert.notEqual(plainText, cipherText);
  });

  it('should decrypt a string', function() {
    var plainText = 'hello';
    var cipherText = vault.encrypt(plainText, password);
    var decipherText = vault.decrypt(cipherText, password);
    assert.notEqual(plainText, cipherText);
    assert.equal(plainText, decipherText);
  });

  it('should store an encrypted string and then retrieve it', function(done) {
    var plainText = 'hello';
    var key = 'greeting';

    vault.put(key, plainText, function(err) {
      if (err) return done(err);

      // verify vault exists and stored the ciphertext
      // associated with the key
      var vault_ = loadVault();
      assert(vault_[key]);

      // should be encrypted
      assert.notEqual(vault_[key], plainText);

      // should be able to decrypt
      vault.get(key, function(err, decipherText) {
        assert.equal(decipherText, plainText);
        done();
      });

    });
  });

  it('should store and then remove a key', function(done) {
    var plainText = 'hello';
    var key = 'greeting';

    vault.put(key, plainText, function(err) {
      if (err) return done(err);

      // verify vault exists and stored the ciphertext
      // associated with the key
      var vault_ = loadVault();
      assert(vault_[key]);

      // should be removed
      vault.remove(key, function(err) {
        if (err) return done(err);
        var vault_ = require(vault.pathname);
        assert(!vault_[key]);
        done();
      });

    });
  });
});

function loadVault() {
  return JSON.parse(fs.readFileSync(vault.pathname, 'utf8'));
}

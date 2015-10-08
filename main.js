var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var vaultFile = path.join(__dirname, 'vault.json');
var vault;

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  get: get,
  put: put,
  remove: remove
};

function loadVault(callback) {
  if (vault) return callback(null, vault);

  fs.readFile(vaultFile, 'utf8', function(err, data) {
    if (err) {
      if (err.code == 'ENOENT') return saveVault({}, callback);
      else return callback(err);
    }

    vault = JSON.parse(data);
    callback(null, vault);
  });
}

function saveVault(vault, callback) {
  if (!vault) return callback();

  var data = JSON.stringify(vault, null, 2);
  fs.writeFile(vaultFile, data, 'utf8', function(err) {
    if (err) return callback(err);
    callback(null, vault);
  });
}

function get(key, callback) {
  loadVault(function(err, vault) {
    if (err) return callback(err);
    callback(null, decrypt(vault[key]));
  });
}

function put(key, plainText, callback) {
  loadVault(function(err, vault) {
    if (err) return callback(err);
    vault[key] = encrypt(plainText);
    return saveVault(vault, callback);
  });
}

function remove(key, callback) {
  loadVault(function(err, vault) {
    if (err) return callback(err);
    delete vault[key];
    return saveVault(vault, callback);
  });
}

function getPassword() {
  var password = process.env.VAULT_PASS;
  if (!password) {
    throw new Error('Vault environment not set: missing VAULT_PASS');
  }

  return password;
}

function encrypt(plainText) {
  var password = getPassword();
  var cipher = crypto.createCipher('aes-256-cbc', password);
  var cipherText = cipher.update(plainText, 'utf8', 'base64');
  return cipherText + cipher.final('base64');
}

function decrypt(cipherText) {
  var password = getPassword();
  var decipher = crypto.createDecipher('aes-256-cbc', password);
  var plainText = decipher.update(cipherText, 'base64', 'utf8');
  return plainText + decipher.final('utf8');
}


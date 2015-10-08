var fs = require('fs');
var path = require('path');
var crypt = require('./crypt');

var filename = '.vault.json';
var home = process.env.HOME || process.env.USERPROFILE;
var pathname = path.resolve(home, filename);
var vault;

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {

  filename: filename,
  pathname: pathname,

  get: function (key, callback) {
    loadVault(function (err, vault) {
      if (err) return callback(err);
      try {
        var cipherText = vault[key];
        if (!cipherText) return callback(null);
        callback(null, decrypt(cipherText));
      } catch (err) {
        callback(err);
      }
    });
  },

  put: function (key, plainText, callback) {
    loadVault(function (err, vault) {
      if (err) return callback(err);
      try {
        vault[key] = encrypt(plainText);
        return saveVault(vault, callback);
      } catch (err) {
        callback(err);
      }
    });
  },

  remove: function (key, callback) {
    loadVault(function (err, vault) {
      if (err) return callback(err);

      // don't just blindly remove the key -- make sure the
      // correct password was supplied or else not authorized
      try {
        if (typeof vault[key] == 'undefined') return callback();
        decrypt(vault[key]);
        delete vault[key];
        return saveVault(vault, callback);
      } catch (err) {
        return callback(new Error('Unable to remove key (wrong password)'));
      }

    });
  },

  encrypt: encrypt,
  decrypt: decrypt

};

function getPassword() {
  var password = process.env.VAULT_PASS;
  if (!password) {
    throw new Error('Vault environment not set: missing VAULT_PASS');
  }
  return password;
}

function loadVault(callback) {
  if (vault) return callback(null, vault);

  fs.readFile(pathname, 'utf8', function(err, data) {
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
  fs.writeFile(pathname, data, 'utf8', function(err) {
    if (err) return callback(err);
    callback(null, vault);
  });
}

function encrypt(plainText) {
  return crypt.encrypt(plainText, getPassword());
}

function decrypt(cipherText) {
  return crypt.decrypt(cipherText, getPassword());
}


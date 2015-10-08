var crypto = require('crypto');

exports.encrypt = function(plainText, password) {
  var cipher = crypto.createCipher('aes-256-cbc', password);
  var cipherText = cipher.update(plainText, 'utf8', 'base64');
  return cipherText + cipher.final('base64');
}

exports.decrypt = function(cipherText, password) {
  var decipher = crypto.createDecipher('aes-256-cbc', password);
  var plainText = decipher.update(cipherText, 'base64', 'utf8');
  return plainText + decipher.final('utf8');
}


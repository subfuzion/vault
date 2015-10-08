vault
=====

Module and command line interface (cli) for encrypting, storing retrieving, and decrypting text.
Encrypted text entries are retrieved by keys (names) in a JSON file stored in your home directory.

    npm install -g vault
    vault --help
    
    export VAULT_PASS=secret
    
    vault set <key> <text>
    vault get <key>
    vault remove <key>

or add to your own package

    npm install --save vault

and add a run script to your `package.json` file to access the cli:

    "scripts": {
      "vault": "vault"
    }
 
This works because `npm` adds `node_modules/.bin` to the path when executing a package run script. Invoke
like this:

    npm run vault

Vault password
--------------

Vault requires that the `VAULT_PASS` environment variable be set before use.

    export VAULT_PASS=secret

You probably want to store the password in your shell profile.

Note: you can use different passwords to encrypt/decrypt different text entries. You can supply
the password directly on the command line, like this:

    VAULT_PASS=secret vault set <key> <text>
    VAULT_PASS=secret vault get <key>
    VAULT_PASS=secret vault remove <key>

API
---

    var vault = require('vault');
    
    vault.put(key, plainText, function(err) {
    }
    
    vault.get(key, function(err, plainText) {
    }
    
    vault.remove(key) {
    }
    
    // utility methods
    
    vault.encrypt(key, plainText, function(err, cipherText) {
    };
    
    vault.decrypt(key, cipherText, function(err, plainText) {
    };



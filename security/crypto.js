module.exports = function (app) {

    const NodeRSA = require('node-rsa');
    const CryptoJS = require('crypto-js');
    const JsonWebToken = require('jwt-simple');
    const generator = require('generate-password');

    const RSAKey = new NodeRSA({
        b: 1024
    });

    var RandomJWTSecret = generator.generate({
        length: 32,
        numbers: true
    });

    var JWTSecret = process.env.JSON_WEB_TOKEN_SECRET || RandomJWTSecret;

    console.log("JWT: " +JWTSecret);

    const cryptoUtil = {

        JWT: {
            encode: function (data) {
                try{
                    return JsonWebToken.encode(data, JWTSecret);
                }
                catch(e){
                    console.log("JWT e: " +e);
                    return null;
                }
            },
            decode: function (data) {
                try{
                    return JsonWebToken.decode(data, JWTSecret);
                }
                catch(e){
                    console.log("JWT e: " +e);
                    return null;
                }
            }
        },

        RSA: {
            publicKey: function () {
                return RSAKey.exportKey('pkcs8-public-pem');
            },

            encrypt: function (plaintData) {
                return RSAKey.encrypt(plaintData, 'base64');
            },

            decrypt: function (cipherData, format) {
                return RSAKey.decrypt(cipherData, format);
            }
        },

        AES: {
            test: function () {

                console.log('\nTest AES:\n');
                var salt = CryptoJS.enc.Utf8.parse("123456789123");
                var password = "123456789123";
                var text = "wow";
                var keyBits = CryptoJS.PBKDF2(password, salt, {
                    hasher: CryptoJS.algo.SHA1,
                    keySize: 8,
                    iterations: 2048
                });

                var iv = CryptoJS.enc.Base64.parse('/fSsDxwE3PLP20qb/sD99g==');

                var encrypted = CryptoJS.AES.encrypt(text, keyBits, {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                });

                console.log('\n ---- CRYPTO -----');
                console.log('iv: ' + iv);
                console.log('key: ' + password);
                console.log('salt: ' + salt);
                console.log('cipherData: ' + encrypted);

                var decrypted = CryptoJS.AES.decrypt(encrypted, keyBits, {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                });
                console.log("\nDecrypted Hex: " + decrypted.toString(CryptoJS.enc.Hex));
                console.log("\nDecrypted utf-8: " + decrypted.toString(CryptoJS.enc.Utf8));
                console.log('\n ---- CRYPTO -----\n');
            },

            encrypt: function (plaintData, ticket) {
                console.log("\nCryptoUtil : encrypt\n");
                console.log("Ticket: " + JSON.stringify(ticket));
                var salt = CryptoJS.enc.Utf8.parse(ticket.salt);
                var key = ticket.key;
                var keyBits = CryptoJS.PBKDF2(key, salt, {
                    hasher: CryptoJS.algo.SHA1,
                    keySize: 8,
                    iterations: 2048
                });

                var iv = CryptoJS.enc.Base64.parse(ticket.iv);

                return CryptoJS.AES.encrypt(plaintData, keyBits, {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                }).toString();
            },

            decrypt: function (cipherData, ticket) {
                var iv = ticket.iv;
                var key = ticket.key;
                var salt = CryptoJS.enc.Utf8.parse(ticket.salt);
                var keyBits = CryptoJS.PBKDF2(key, salt, {
                    hasher: CryptoJS.algo.SHA1,
                    keySize: 8,
                    iterations: 2048
                });
                console.log('\n ---- CRYPTO -----');
                console.log('iv: ' + iv);
                console.log('key: ' + key);
                console.log('salt: ' + salt);
                console.log('cipherData: ' + cipherData);
                console.log('\n ---- CRYPTO -----\n');
                return JSON.parse(CryptoJS.AES.decrypt(cipherData, keyBits, {
                    iv: CryptoJS.enc.Base64.parse(iv),
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                }).toString(CryptoJS.enc.Utf8).replace("\\", ""));
            }
        }
    };

    return cryptoUtil;
}
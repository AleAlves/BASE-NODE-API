
module.exports = function (app) {

    //STRING FRO DEV ONLY
    const RSAPrivateKey = process.env.RSA || 
    '-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIIEogIBAAKCAQBcKr188EvZSvVpnd5r5LPqgRRarJcx2oqLBiypvQlT2+WjTX5L'+
    'EK87Sb8AQckKIOD5vnaadNsND1+xxMgZjmknar0kkgeZ+8lYcuQRXW3UYaRI8Byt'+
    'niE/d8rjBVE4K8VCp0DmOMAUe5KTsdaj++KJa3rZFOEt3ESP+VeOvCfKLXMn0WdM'+
    'thQPTdKfQtJfKGyuOW4RyIsDZlflTBz9aCR2hSdk5XylPfjSF6m/wAF+YVplA8YP'+
    'CHlS/VEi4VzhskpplbmHLamUcfKKhRwCiqNwkr3ad47DCDpyMyi4vPp+MD5ADACI'+
    'sVWTnDhhfU8lhc7n00yY7ERruCJ9yyiG9pT9AgMBAAECggEALe8HHPtNcfAPuyF4'+
    'tmD24cqO8FnPyILYRU1AeR/DRE31dpuqc5LPIkcwr9oZbbjRJuariXLvsOSWlqwx'+
    '5bq54XEq7szwiOeZg0FPNPBRSmWXUNqKEGUcwNrc/KOrxMjbuMpOZ+6knBCyDnW1'+
    'OWjRkBdG1GW5i/eZG//yiSpw0iuXVB/m5oJhguKPqR7K241kNgJNg3jbbaX+qIRI'+
    '4eV9UVEV58yUUlqdRCB7ge0HhM+NnMHaT2IihNc4ZtjvKg+75hI4/R/oorQPecl1'+
    'Cf706GbdtzbB4dTkX1dvO7ntOqPUtdEKCqaReoEiYk4zJ9uLqn93giYYQFC9a25W'+
    'X8nxaQKBgQCglC5E3i4EvLUS/D8MftYQ686nllccdL4ywDw4J7iTuQEqRq3wacbG'+
    'YBrnTVx6JRO+PK4deP5cdrJvBtQceXOTjbgkO+wzPYEQ3Lb0kEQb56bEmXbmHikn'+
    'gSykZRhGZoAPyGoUfUp1q3zb1Syp0XP/37uAo+/dzG0LwI6y7Jaq+wKBgQCS74C/'+
    '6B4vmsxlUNrUA1bb9chI39/cNHKYL0594A9pr4+gT5d3bF3SMMtGMq2x4Ne1rNh2'+
    'xlEz7XGbsZptS20NT9ljs3388S848mETdtJNeiAsPxIc5/kYFNCKemp9+b1CmQIP'+
    '8cBpzCr8Zc+XiIfZvN89G3UNvN2YmG53Z50+ZwKBgGz/SEzc1zXF9c82Q4Gy0pFX'+
    'zsV4yhZ5s+T1Eas4YxR6nqzYnxayZgefkoNwwpXydu1JeRJuX5HZzBKK+w187xO4'+
    'PcbymcjKNcKBXvqwtlqOqmeGl+tpi5vSFcBdEtYumzybWE4iIZmv1qfNkmyOzQNh'+
    'FYAjRx0xts8kXHhdGYRjAoGAf3c/1LszfI6oY/gJbcTb1ANa1UVJOQlSpAzd5bq7'+
    'BC7lxOdm+ZXLqizkGqiaH+ZymsswGZGfHhIM7UjcM5YsK1EqwCAU2poMIjW52x3I'+
    'AKhCQsAQIX1njOl5o7fgrBo7ggukS1qoVd9lJwHXXZh2aYA8lRE9sUY3YkpSAkmj'+
    'kl8CgYEAkBdWbp/6yRUNvBvcE3Wnsie9HQIXoxiOvJtvTA29JYwgmutmRf7U9oVs'+
    '4EPBDhW5agtcyeToJ2VUw9AWj9d8v7eXXqwbUR6J7iArFMDiEEd8WJOv+w5BBnZp'+
    'IGiW1CEPF9Xs2cshJJDqjxv0U3AxB9Aqx4nWh/QWayfEfTKu8tU='+
    '\n-----END RSA PRIVATE KEY-----';

    //RSA
    const NodeRSA = require('node-rsa');
    // console.log("RSA PVTK: "+ RSAPrivateKey);
    const RSAKey = new NodeRSA(RSAPrivateKey);

    const CryptoJS = require('crypto-js');

    const cryptoUtil = {

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
            },

            encrypt: function (plaintData, ticket) {
                console.log("\nCryptoUtil : encrypt\n");
                console.log("Ticket: "+JSON.stringify(ticket));
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
                console.log('iv: ' + iv);
                console.log('key: ' + key);
                console.log('salt: ' + salt);
                console.log('cipherData: ' + cipherData);
                return JSON.parse(CryptoJS.AES.decrypt(cipherData, keyBits, {
                    iv: CryptoJS.enc.Base64.parse(iv),
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                }).toString(CryptoJS.enc.Utf8).replace("\\" ,""));
            }
        }
    };

    return cryptoUtil;
}
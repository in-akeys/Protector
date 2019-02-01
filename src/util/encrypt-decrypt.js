const crypto = require('crypto');

module.exports.encrypt = function (password, data, algorithm = 'aes-192-cbc') {
    try {
        if (!password || !data)
            return;
        // Key length is dependent on the algorithm. In this case for aes192, it is
        // 24 bytes (192 bits).
        // Use async `crypto.scrypt()` instead.
        const key = crypto.scryptSync(password, 'salt', 24);
        // Use `crypto.randomBytes()` to generate a random iv instead of the static iv
        // shown here.
        const iv = Buffer.alloc(16, 0); // Initialization vector.
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (err) {
        console.log(err)
        return false;
    }
}

module.exports.decrypt = function (password, data, algorithm = 'aes-192-cbc') {
    try {
        if (!password || !data)
            return;
        const key = crypto.scryptSync(password, 'salt', 24);
        // The IV is usually passed along with the ciphertext.
        const iv = Buffer.alloc(16, 0); // Initialization vector.

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.log(err)
        return false;
    }
}
const CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is missing from .env");
};


// Encrypt sensitive data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(
        String(data),
        ENCRYPTION_KEY
    ).toString();
};


// Decrypt sensitive data
const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        ENCRYPTION_KEY
    );

    return bytes.toString(CryptoJS.enc.Utf8);
};


module.exports = {
    encryptData,
    decryptData
};
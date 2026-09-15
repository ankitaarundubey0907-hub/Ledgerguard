require("dotenv").config();

const {
    encryptData,
    decryptData
} = require("./src/utils/encryption");

const originalData = "Sensitive Financial Data 50000";

const encryptedData = encryptData(originalData);

const decryptedData = decryptData(encryptedData);

console.log("Original:", originalData);
console.log("Encrypted:", encryptedData);
console.log("Decrypted:", decryptedData);

if (originalData === decryptedData) {
    console.log("Encryption test PASSED");
} else {
    console.log("Encryption test FAILED");
}
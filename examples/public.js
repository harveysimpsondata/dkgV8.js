const rpcURL = 'https://base-sepolia.blockpi.network/v1/rpc/e936ae8089c376ede4a02520f156a719600de756'; // RPC URL

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

require('dotenv').config({ path: '../.env' });


// Function to convert private key to public address
function getPublicAddress(privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    return account.address;
}
console.log(process.env.PRIVATE_KEY_1);
// Wallets (private keys) to loop through from the .env file
const privateKeys = [
    process.env.PRIVATE_KEY_1,
    process.env.PRIVATE_KEY_2,
    process.env.PRIVATE_KEY_3,
    process.env.PRIVATE_KEY_4,
    process.env.PRIVATE_KEY_5,
    process.env.PRIVATE_KEY_6,
    process.env.PRIVATE_KEY_7,
    process.env.PRIVATE_KEY_8,
    process.env.PRIVATE_KEY_9,
    process.env.PRIVATE_KEY_10,
    process.env.PRIVATE_KEY_11,
    process.env.PRIVATE_KEY_12,
    process.env.PRIVATE_KEY_13,
    process.env.PRIVATE_KEY_14,
    process.env.PRIVATE_KEY_15,
    process.env.PRIVATE_KEY_16,
    process.env.PRIVATE_KEY_17,
    process.env.PRIVATE_KEY_18,
    process.env.PRIVATE_KEY_19,
    process.env.PRIVATE_KEY_20,
    process.env.PRIVATE_KEY_21,
    process.env.PRIVATE_KEY_22,
    process.env.PRIVATE_KEY_23,
    process.env.PRIVATE_KEY_24,
    process.env.PRIVATE_KEY_25,
    process.env.PRIVATE_KEY_26,
    process.env.PRIVATE_KEY_27,
    process.env.PRIVATE_KEY_28,
    process.env.PRIVATE_KEY_29,
    process.env.PRIVATE_KEY_30,
    process.env.PRIVATE_KEY_31,
    process.env.PRIVATE_KEY_32,
    process.env.PRIVATE_KEY_33,
    process.env.PRIVATE_KEY_34,
    process.env.PRIVATE_KEY_35,
    process.env.PRIVATE_KEY_36,
    process.env.PRIVATE_KEY_37,
    process.env.PRIVATE_KEY_38,
    process.env.PRIVATE_KEY_39,
    process.env.PRIVATE_KEY_40,
    process.env.PRIVATE_KEY_41,
    process.env.PRIVATE_KEY_42,
    process.env.PRIVATE_KEY_43,
    process.env.PRIVATE_KEY_44,
    process.env.PRIVATE_KEY_45,
    process.env.PRIVATE_KEY_46,
    process.env.PRIVATE_KEY_47,
    process.env.PRIVATE_KEY_48,
    process.env.PRIVATE_KEY_49,
    process.env.PRIVATE_KEY_50,
];

// Convert private keys to public addresses
const walletsUsed = {};
privateKeys.forEach((privateKey, index) => {
    if (privateKey) {
        const publicAddress = getPublicAddress(privateKey);
        walletsUsed[`dkg_spend_${index + 1}`] = publicAddress;
    }
});

// Log the converted wallet addresses
console.log(walletsUsed);

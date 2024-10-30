// Set up the Web3 provider
const rpcURL = 'https://base-sepolia.blockpi.network/v1/rpc/e936ae8089c376ede4a02520f156a719600de756'; // RPC URL

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

// ERC721 token contract address and ABI (simplified ABI for Transfer event)
const tokenContractAddress = '0xb8B904c73D2fB4D8c173298A51c27Fab70222c32';

// ABI for ERC721's Transfer event
const tokenAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

// Create a contract instance
const tokenContract = new web3.eth.Contract(tokenAbi, tokenContractAddress);

// Wallets to loop through
const wallets_used = {
    "dkg_spend_1": '0x87803385D2bCe9cbc7c532AD7ab2B9C665C2023E',
    "dkg_spend_2": '0x2C107f170fc57FFe97A3088BB26BdfA876936AC3',
    "dkg_spend_3": '0x253D6F4EDdeC078d40bf3CD76A2b6b5E9059E123',
    "dkg_spend_4": '0xE5F284Cb38D7764BfC0e9FfFFb95eAD3F0F105d7',
    "dkg_spend_5": '0x41E2596C5e597D2984Aa7B60d73a617c5F36eDF7',
    "dkg_spend_6": '0xc579a2626e2c715a58d825B8F857e8021FaCF2B8',
    "dkg_spend_7": '0xFF227e7F7A0426F409aa9BE1d72d12A28337e4d4',
    "dkg_spend_8": '0xE6A3fdb044B9fd8fd05FB49E41BE80414646f084',
    "dkg_spend_9": '0x90Cfb4E446fE94F70A960eEEd66eBa129Ccc9bD4',
    "dkg_spend_10": '0x75a0757cC1ABfbebC4670E136Cafb756C502F03B',
    "dkg_spend_11": '0x863AD930c62c8E4debFc51ec933D3Be213e7b16f',
    "dkg_spend_12": '0x322e89E0F3CaF47C3D51cc39d04622FC2ebf917d',
    "dkg_spend_13": '0xb58F02Ae3363e6EccA33F9B03c10Ed69fcB1d60D',
    "dkg_spend_14": '0x2e314de28520AD5Ec38426955A0Eb53b899E431E',
    "dkg_spend_15": '0x9d5193cd63757542e5bE3128ff7dB5f515156f82',
    "dkg_spend_16": '0x8798E74d5FDD4768c7Cffe7BA20E1B5275454844',
    "dkg_spend_17": '0x121df10E6B053342C64FC23dd9F2AF88aBb3ae64',
    "dkg_spend_18": '0xf7da07e1a618D15730a9c1fadAb5909f4E0b5674',
    "dkg_spend_19": '0x4a267F47B8C00C28226aeC2050bF8C230DF3d475',
    "dkg_spend_20": '0x49bEd47ec5721984C4E7EB1CB2Be8Aa858668B72',
    "dkg_spend_21": '0x4d7a90180D311D06EE0e87325216e727231147d3',
    "dkg_spend_22": '0x7f9E5e769adB92576A55be1632274A12105E518D',
    "dkg_spend_23": '0x2d438Ee834a83A622bCf71574eEf670ca2d44599',
    "dkg_spend_24": '0x92ab96c619B8fE65EfeaE6Ba1fB7f46E57bFDc30',
    "dkg_spend_25": '0x3F208455f565CDbB7996A73D9fE8b7153BE1Fe13',
    "dkg_spend_26": '0x49edA2d33361f7fA7276c0121eAd1B42A6f7674e',
    "dkg_spend_27": '0xf5A8496Fd2fB0a2F08E492bfb295CB50035749d6',
    "dkg_spend_28": '0xd54b45E6c2Bc2E5C7eB64D6AaD51bc774Fcfc14d',
    "dkg_spend_29": '0xA757E43f8480eEA546cE1Bb0A9c9D57b3E0240F7',
    "dkg_spend_30": '0xCC0fb793BCbE116D7564E93b69FC9c486436D5E6',
    "dkg_spend_31": '0x34d001C0eC02132b37D0c2b566a9Ac58829502e9',
    "dkg_spend_32": '0x1797Bd77ac76911897d4c7591405087CeBe5Ad73',
    "dkg_spend_33": '0x241Ad9249D8636a3c3746f78C7e25b19E5AB4841',
    "dkg_spend_34": '0x37ED158e3Fc79c1aF3c4e5b4CBdafE339CD34B23',
    "dkg_spend_35": '0x97B9B2BE2E46b9A17C73563669484f665dF71493',
    "dkg_spend_36": '0x9A02aB2Fbeb6ea3d66b27CF3175d5Eb04048dA29',
    "dkg_spend_37": '0x04F131108316b6270f1F15187D685ab98E775e2B',
    "dkg_spend_38": '0xC2AA2A9186652d6844c0Db0231d34fB04516674D',
    "dkg_spend_39": '0xD0A1880590D5e9eC31019D4110a494B63911A5a7',
    "dkg_spend_40": '0xf5fc178ddb5513DE8CFe77917F4803e3770f66B9',
    "dkg_spend_41": '0x91fc11F52Fea4d72D2F90f94Fdde95c0F6EC0Abd',
    "dkg_spend_42": '0x81b40E49B850F6347DBD369Ee75Ab9296d5b455F',
    "dkg_spend_43": '0x37d5E41eCD875b8f94409A7799803701EBd18109',
    "dkg_spend_44": '0x9e8F24C7050f8D3AdE2946EeEB292581a9F57274',
    "dkg_spend_45": '0x07Efbd54BdB7dB8a1d429FF00ca23aF69612b6A6',
    "dkg_spend_46": '0x3ea7f5c2E568c04996AB64F9952Be0EdaF55eEa9',
    "dkg_spend_47": '0x1088929FC7b516a2Fd1090f8bb643e1334895265',
    "dkg_spend_48": '0x4a23bfcB29682F6FF88beab64254606Cfb30616D',
    "dkg_spend_49": '0x0eC0B6AED0FDFd46bFf04E45B99F8CD0FD5D4A9E',
    "dkg_spend_50": '0x4d1c9F1b08E411b01aCf68894C1568E9745D333F'
};

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'wallets_ual');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to fetch all token IDs for a specific wallet in batches
async function fetchTokenIdsForWallet(walletName, walletAddress, batchSize = 5000) {
    try {
        const latestBlock = await web3.eth.getBlockNumber();
        const tokenIds = [];
        const outputFilePath = path.join(outputDir, `${walletName}.txt`);

        // Clear the output file before starting
        fs.writeFileSync(outputFilePath, '', 'utf8');

        // Fetch events in batches
        for (let fromBlock = 10178746; fromBlock <= latestBlock; fromBlock += batchSize) {
            const toBlock = Math.min(fromBlock + batchSize - 1, latestBlock);
            console.log(`Fetching blocks from ${fromBlock} to ${toBlock} for ${walletName}`);

            try {
                const events = await tokenContract.getPastEvents('Transfer', {
                    filter: { to: walletAddress },
                    fromBlock,
                    toBlock
                });


                // Extract the token IDs from the events and add them to the list
                events.forEach(event => {
                    const tokenId = event.returnValues.tokenId;
                    tokenIds.push(tokenId);

                    // Append each token ID to the file
                    fs.appendFileSync(outputFilePath, `${tokenId}\n`, 'utf8');
                });
            } catch (error) {
                console.error(`Error fetching logs for block range ${fromBlock} - ${toBlock}:`, error);
            }
        }

        console.log(`Total Token IDs for ${walletName} (${walletAddress}):`, tokenIds.length);
        console.log(`Token IDs have been saved to ${outputFilePath}`);
        return tokenIds;
    } catch (error) {
        console.error(`Error fetching token IDs for ${walletName}:`, error);
    }
}

// Function to loop through all wallets and fetch token IDs
async function fetchAllWalletsTokenIds() {
    for (const [walletName, walletAddress] of Object.entries(wallets_used)) {
        await fetchTokenIdsForWallet(walletName, walletAddress);
    }
}

// Run the function
fetchAllWalletsTokenIds();
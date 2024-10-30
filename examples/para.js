const DKG = require('dkg.js');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Capture the command-line argument to select keys



// Validate and fetch the keys from environment variables
const PUBLIC_KEY = "0x87803385D2bCe9cbc7c532AD7ab2B9C665C2023E"
const PRIVATE_KEY = "58c3328907229f8cfade1aa2801ece09406bbf1cff2c8bcea402504ba28a9049"
const HOST_NODE = "http://134.122.115.137"
const TEMPORARY_PUBLIC_KEY = "0x95FadEE299a9ac1587Be025c2a3a2cD388921119";

const web3 = new Web3('https://sepolia.base.org'); // Provide the web3 provider URL

if (!PUBLIC_KEY || !PRIVATE_KEY) {
    console.error(`Invalid or missing key for argument ${keyIndex}. Use 1-24.`);
    process.exit(1);
}

// NFT data options
const NFT_DATA = {
    brands: ['Tesla', 'Ford', 'BMW', 'Audi'],
    models: ['Model X', 'Mustang', 'Q7', 'Qashqai'],
    engineTypes: ['Electric motor', 'V6'],
    fuelTypes: ['Electric', 'Gasoline'],
};


// Initialize DKG client
const dkg = new DKG({
    environment: 'testnet',
    endpoint: HOST_NODE,
    port: 8900,
    blockchain: { name: 'base:84532', publicKey: PUBLIC_KEY, privateKey: PRIVATE_KEY },
    maxNumberOfRetries: 30,
    frequency: 2,
    contentType: 'all',
});

// // Path for storing Paranet data
// const PARANET_FILE_PATH = path.join(__dirname, 'paranets_open_nodes.json');

// // Function to read Paranet data from a JSON file
// function readParanetData() {
//     if (fs.existsSync(PARANET_FILE_PATH)) {
//         const data = fs.readFileSync(PARANET_FILE_PATH);
//         return JSON.parse(data);
//     }
//     return {};
// }

// // Function to write Paranet data to a JSON file
// function writeParanetData(data) {
//     fs.writeFileSync(PARANET_FILE_PATH, JSON.stringify(data, null, 2));
// }

// function saveParanetUal(paranetKey, ual) {
//     // Read existing Paranet data
//     const paranetData = readParanetData();

//     // Check if the key already exists
//     if (paranetData[paranetKey]) {
//         console.log(`Key "${paranetKey}" already exists with value: ${paranetData[paranetKey]}. No action taken.`);
//         return; // Exit the function if the key exists
//     }

//     // If the key does not exist, add it to the data
//     paranetData[paranetKey] = ual;

//     // Write the updated data back to the JSON file
//     writeParanetData(paranetData);

//     console.log(`Key "${paranetKey}" added with value: ${ual}`);
// }


// Function to create or retrieve a Paranet
async function createParanet() {
    const paranetKey = PUBLIC_KEY;

    // Create a new Paranet since it doesn't exist
    let content = {
        public: {
            '@context': ['https://schema.org'],
            '@id': `uuid:${paranetKey}`,
            '@type': 'Paranet',
            name: `Shits need to sync please`,
            description: 'Please let me finish syncing this',
            company: 'AutomotiveNFTDAO',
            assetType: 'Car',
            supportedBrands: NFT_DATA.brands,
            supportedModels: NFT_DATA.models,
            engineTypes: NFT_DATA.engineTypes,
            fuelTypes: NFT_DATA.fuelTypes,
            creator: {
                '@id': `uuid:creator:${paranetKey}`,
                name: 'Automotive Enthusiast Group',
            },
            headquarters: {
                '@type': 'Place',
                name: 'Auto City',
                address: '1234 Car Lane, Motorville, AutoCountry',
            },
        }
    };

    // Create the Paranet knowledge asset
    const paranetAssetResult = await dkg.asset.create(content, { epochsNum: 1 });
    console.log('Paranet knowledge asset created:', paranetAssetResult);
    await dkg.paranet.create(paranetAssetResult.UAL, {
        paranetName: 'syncing ...',
        paranetDescription: '....',
        paranetNodesAccessPolicy: 0,
        paranetMinersAccessPolicy: 0,
    });
    console.log(`Paranet registered: ${paranetAssetResult.UAL}`);

    // saveParanetUal(paranetKey, paranetAssetResult.UAL);
    return paranetAssetResult.UAL;
}


async function main() {
    try {
        // sending transaction, incase one is stuck. Not bothering checking.
        // await sendNewTransaction();
        await createParanet();
    } catch (error) {
        console.error('Error creating paranet:', error);
    }
}

async function sendNewTransaction() {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    const gas_price = await web3.eth.getGasPrice();

    const estimateGas = await web3.eth.estimateGas({
        value: web3.utils.toWei('0.00001', 'ether'),
        from: PUBLIC_KEY,
        to: TEMPORARY_PUBLIC_KEY,
    });

    const newTransaction = {
        from: PUBLIC_KEY,
        to: TEMPORARY_PUBLIC_KEY,
        value: web3.utils.toWei("0.00001", "ether"),
        gasLimit: estimateGas,
        gasPrice: gas_price * 4,
        nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(newTransaction, PRIVATE_KEY);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Start the application
main();

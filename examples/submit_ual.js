const DKG = require('dkg.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const Web3 = require('web3');

// Capture the command-line argument to select keys
const [keyIndex] = process.argv.slice(2);

const PUBLIC_KEY = process.env[`PUBLIC_KEY_${keyIndex}`];
const PRIVATE_KEY = process.env[`PRIVATE_KEY_${keyIndex}`];
const UAL_FILE = `dkg_spend_${keyIndex}.txt`;  // Assuming the UAL file has a .txt extension
const HOST_NODE = process.env.NODE_HOSTNAME;

if (!PUBLIC_KEY || !PRIVATE_KEY) {
    console.error(`Invalid or missing key for argument ${keyIndex}. Use 1-48.`);
    process.exit(1);
}

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize DKG client
const dkg = new DKG({
    environment: 'testnet',
    endpoint: HOST_NODE,
    port: 8900,
    blockchain: { name: 'base:84532', publicKey: PUBLIC_KEY, privateKey: PRIVATE_KEY },
    maxNumberOfRetries: 30,
    frequency: 3,
    contentType: 'all',
});




// Function to read UALs from the text file
async function getUalsFromTxt(file) {
    try {
        const inputDir = path.join(__dirname, 'wallets_ual');
        const filePath = path.join(inputDir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== ''); // Split by new line and remove empty lines
    } catch (error) {
        console.error(`Error reading UALs from file ${file}:`, error);
        throw error;
    }
}

// Function to submit UAL to the Paranet
async function submitUalToParanet(assetUal, paranetUal) {
    try {
        // Assuming DkgClient has a method to submit the UAL to Paranet
        const submitResult = await dkg.asset.submitToParanet(assetUal, paranetUal);
        return submitResult;
    } catch (error) {
        console.error(`Error submitting UAL ${assetUal} to Paranet ${paranetUal}:`, error);
        throw error;  // Rethrow to allow retry mechanism to work
    }
}

async function addFailedToNewCsv(keyIndex, assetUAL, paranetUAL) {
    try {
        // Use the keyIndex to create a unique filename
        const failedFilePath = path.join(__dirname, `failed_submits_${keyIndex}.csv`);

        // CSV entry with only assetUAL and paranetUAL
        const csvEntry = `${assetUAL},${paranetUAL}\n`;

        // Append the CSV entry to the file
        fs.appendFileSync(failedFilePath, csvEntry, 'utf8');

        console.log(`Logged failed submission for keyIndex ${keyIndex}: assetUAL ${assetUAL}, paranetUAL ${paranetUAL}`);
    } catch (error) {
        console.error(`Error logging failed UAL submission for assetUAL ${assetUAL}, paranetUAL ${paranetUAL}:`, error);
    }
}


async function main() {
    try {
        // Get the Paranet UAL
        const paranet = 'did:dkg:base:84532/0xb8b904c73d2fb4d8c173298a51c27fab70222c32/5588244'
        // Get UALs from the text file
        const uals = await getUalsFromTxt(UAL_FILE);
        // Loop through the UALs and submit them
        for (const assetUal of uals) {
            let success = false;
            let retries = 0;
            const maxRetries = 5;

            while (!success && retries < maxRetries) {
                try {
                    const submitResult = await submitUalToParanet(assetUal, paranet);
                    console.log('======================== SUBMIT TO PARANET SUCCESS ========================');
                    console.log({
                        paranetUAL: paranet,
                        assetUAL: assetUal,
                        submitResult
                    });
                    success = true;
                } catch (error) {
                    retries++;
                    console.log(`Retrying submission of ${assetUal} (${retries}/${maxRetries})...`);
                    await delay(2000);  // Delay before retrying
                }
            }
            if (!success) {
                console.error(`Failed to submit ${assetUal} into ${paranet} after ${maxRetries} retries.`);
                await addFailedToNewCsv(keyIndex, assetUal, paranet);
            }

        }

    } catch (error) {
        console.error('Error initializing the application:', error);
    }
}

// Start the application
main();
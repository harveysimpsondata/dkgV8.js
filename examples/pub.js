require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const path = require('path');
const DKG = require('dkg.js');
const { v5: uuidv5 } = require('uuid');

// Load environment variables
const node_hostname = process.env.NODE_HOSTNAME;
const node_port = process.env.NODE_PORT;
const rpc_uri = process.env.BASE_TESTNET_URI;
console.log(`RPC URI: ${rpc_uri} ${node_hostname}`);

// Load private and public keys from the environment
const keyPairs = [
    {
        publicKey: process.env.PUBLIC_KEY_7,
        privateKey: process.env.PRIVATE_KEY_7,
    },
    {
        publicKey: process.env.PUBLIC_KEY_8,
        privateKey: process.env.PRIVATE_KEY_8,
    },
    {
        publicKey: process.env.PUBLIC_KEY_9,
        privateKey: process.env.PRIVATE_KEY_9,
    }
];

// Create the DKG client for each key pair
const createDKGClient = (publicKey, privateKey) => {
    return new DKG({
        environment: 'testnet',
        endpoint: node_hostname,
        port: node_port,
        blockchain: {
            name: 'base:84532',
            publicKey: publicKey,
            privateKey: privateKey,
            rpcUri: rpc_uri,
        },
        maxNumberOfRetries: 30,
        frequency: 2,
        contentType: 'all',
    });
};

// Load CSV files into a single array of objects
const loadCSVFiles = (folderPath) => {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'));
    let combinedData = [];

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const csvData = fs.readFileSync(filePath, 'utf8');
        const lines = csvData.split('\n').filter(line => line.trim() !== '');  // Ensure no empty lines
        const headers = lines[0].split(',').map(header => header.trim());  // Clean header names

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value ? value.trim() : ''); // Handle missing values
            const record = headers.reduce((obj, header, index) => {
                obj[header] = values[index] || '';  // Assign empty string if value is missing
                return obj;
            }, {});
            combinedData.push(record);
        }
    });

    return combinedData;
};



// Use the DNS namespace (the same as uuid.NAMESPACE_DNS in Python)
//const DNS_NAMESPACE = uuidv5.URL; // This is the closest equivalent to Python's uuid.NAMESPACE_DNS

const crypto = require('crypto');

// Generate a unique ID based on selected values using SHA-256 hashing
const generateUniqueId = (first_name, last_name, email, gender, ip_address) => {
    const randomString = `${first_name}_${last_name}_${email}_${gender}_${ip_address}`;

    // Generate a SHA-256 hash of the concatenated string
    return crypto.createHash('sha256').update(randomString).digest('hex');
};



// Randomly select values from each column
const generateRandomRecord = (df) => {
    const getRandomValue = (column) => column[Math.floor(Math.random() * column.length)];

    return {
        first_name: getRandomValue(df.map(row => row.first_name).filter(Boolean)),
        last_name: getRandomValue(df.map(row => row.last_name).filter(Boolean)),
        email: getRandomValue(df.map(row => row.email).filter(Boolean)),
        gender: getRandomValue(df.map(row => row.gender).filter(Boolean)),
        ip_address: getRandomValue(df.map(row => row.ip_address).filter(Boolean)),
    };
};

// Create JSON-LD data for a knowledge asset
const createJsonLD = (record) => {
    return {
        "@context": {
            "@vocab": "http://schema.org/",
            "first_name": "http://schema.org/givenName",
            "last_name": "http://schema.org/familyName",
            "email": "http://schema.org/email",
            "gender": "http://schema.org/gender",
            "ip_address": "http://schema.org/ipAddress"
        },
        "@graph": [{
            "@type": "Person",
            "id": record.id,
            "first_name": record.first_name,
            "last_name": record.last_name,
            "email": record.email,
            "gender": record.gender,
            "ip_address": record.ip_address
        }]
    };
};

// Upload knowledge asset with allowance management
const uploadKnowledgeAssetWithIncrease = async (jsonLdData, publicKey, privateKey) => {
    try {
        const dkgClient = createDKGClient(publicKey, privateKey);

        // Format the knowledge asset
        const formattedAssertions = await dkgClient.assertion.formatGraph({ public: jsonLdData });
        console.log('======================== ASSET FORMATTED');

        // Calculate the bid suggestion for the asset
        const publicAssertionId = await dkgClient.assertion.getPublicAssertionId({ public: jsonLdData });
        const publicAssertionSize = await dkgClient.assertion.getSizeInBytes({ public: jsonLdData });
        const bidSuggestion = await dkgClient.network.getBidSuggestion(publicAssertionId, publicAssertionSize, { epochsNum: 1 });
        console.log('======================== BID SUGGESTION CALCULATED');
        console.log(bidSuggestion);

        // Check current allowance
        const currentAllowance = await dkgClient.asset.getCurrentAllowance();
        console.log(`Current allowance: ${currentAllowance}`);

        // Increase allowance if below bid suggestion
        if (currentAllowance < bidSuggestion) {
            console.log(`Increasing allowance by ${bidSuggestion - currentAllowance}`);
            await dkgClient.asset.increaseAllowance(bidSuggestion);
            console.log('======================== ALLOWANCE INCREASED');
        }

        // Create the asset after increasing allowance
        const createAssetResult = await dkgClient.asset.create({ public: jsonLdData }, { epochsNum: 1 });
        console.log('======================== ASSET CREATED');
        console.log(createAssetResult);

        if (createAssetResult && createAssetResult.UAL) {
            const isValidUAL = await dkgClient.asset.isValidUAL(createAssetResult.UAL);
            console.log(`Is UAL valid: ${isValidUAL}`);
        }
    } catch (error) {
        console.error('Error creating asset:', error);
    }
};

// Main execution
const main = async () => {
    const folderPath = '/Users/leesimpson/mock_data/';
    const df = loadCSVFiles(folderPath);
    const numThreads = keyPairs.length; // Each thread is assigned a unique key pair

    const assignPrivateKeyToThread = async (threadId, df) => {
        const { publicKey, privateKey } = keyPairs[threadId];
        const randomRecord = generateRandomRecord(df);
        randomRecord.id = generateUniqueId(randomRecord.first_name, randomRecord.last_name, randomRecord.email, randomRecord.gender, randomRecord.ip_address);
        const jsonLdData = createJsonLD(randomRecord);
        await uploadKnowledgeAssetWithIncrease(jsonLdData, publicKey, privateKey);
    };

    while (true) {
        const promises = [];
        for (let threadId = 0; threadId < numThreads; threadId++) {
            promises.push(assignPrivateKeyToThread(threadId, df));
        }
        await Promise.all(promises);
        console.log('Waiting 0.1 second before running the next batch...');
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};

main().catch(console.error);

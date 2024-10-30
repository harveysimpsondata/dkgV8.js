require('dotenv').config({ path: '../.env' });  // Load environment variables from .env
const fs = require('fs');
const path = require('path');
const DKG = require('dkg.js');
const { v5: uuidv5 } = require('uuid');

// Load environment variables
const node_hostname = process.env.NODE_HOSTNAME;
const node_port = process.env.NODE_PORT;
const rpc_uri = process.env.BASE_TESTNET_URI;

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


const crypto = require('crypto');

// Generate a unique ID based on selected values using SHA-256 hashing
const generateUniqueId = (first_name, last_name, email, gender, ip_address) => {
    const randomString = `${first_name}_${last_name}_${email}_${gender}_${ip_address}`;

    // Generate a SHA-256 hash of the concatenated string
    return crypto.createHash('sha256').update(randomString).digest('hex');
};

// Debugging the generateRandomRecord function
const generateRandomRecord = (df) => {
    const getRandomValue = (column) => column[Math.floor(Math.random() * column.length)];

    const first_name = getRandomValue(df.map(row => row.first_name).filter(Boolean));
    const last_name = getRandomValue(df.map(row => row.last_name).filter(Boolean));
    const email = getRandomValue(df.map(row => row.email).filter(Boolean));
    const gender = getRandomValue(df.map(row => row.gender).filter(Boolean));
    const ip_address = getRandomValue(df.map(row => row.ip_address).filter(Boolean));

    // Print out the randomly selected values for debugging
    //console.log('Randomly selected record:');
    //console.log({ first_name, last_name, email, gender, ip_address });

    return {
        first_name,
        last_name,
        email,
        gender,
        ip_address
    };
};

const main = async () => {
    const folderPath = '/Users/leesimpson/mock_data/';
    const df = loadCSVFiles(folderPath);

    // Generate a random record and print it
    const randomRecord = generateRandomRecord(df);
    //console.log('Generated Random Record:', randomRecord);
    randomRecord.id = generateUniqueId(randomRecord.first_name, randomRecord.last_name, randomRecord.email, randomRecord.gender, randomRecord.ip_address);
    console.log(randomRecord)
};

main().catch(console.error);

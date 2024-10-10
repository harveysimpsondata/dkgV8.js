const fs = require('fs');
const path = require('path');
const node_hostname = process.env.NODE_HOSTNAME;
const node_port = process.env.NODE_PORT;
const rpc_uri = process.env.BASE_TESTNET_URI;
console.log(`RPC URI: ${rpc_uri} ${node_hostname}`);
// Load CSV files into a single array of objects
const loadCSVFiles = (folderPath) => {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'));
    let combinedData = [];

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const csvData = fs.readFileSync(filePath, 'utf8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const record = headers.reduce((obj, header, index) => {
                // Handle missing or undefined values gracefully
                obj[header.trim()] = values[index] ? values[index].trim() : '';
                return obj;
            }, {});
            combinedData.push(record);
        }
    });

    return combinedData;
};

// Test function to load CSV and print the result
const testLoadCSV = (folderPath) => {
    try {
        const data = loadCSVFiles(folderPath);
        console.log('CSV Data Loaded Successfully');
        console.log(data); // Print the loaded CSV data for inspection
    } catch (error) {
        console.error('Error loading CSV files:', error);
    }
};

// Provide the folder path where the CSV files are stored
const folderPath = '/Users/leesimpson/mock_data'; // Change this to the path where your CSV files are located

testLoadCSV(folderPath);



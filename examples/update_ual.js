const fs = require('fs');
const path = require('path');

// Directory containing the .txt files
const inputDir = path.join(__dirname, 'wallets_ual');

// Token contract address to be included in the modified lines
const tokenContractAddress = '0xb8b904c73d2fb4d8c173298a51c27fab70222c32';

// Function to modify each line in the specified format
function modifyLine(line) {
    return `did:dkg:base:84532/${tokenContractAddress}/${line}`;
}

// Function to modify all lines in a .txt file
function modifyFileContent(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = fileContent
        .split('\n')
        .filter(line => line.trim() !== '') // Filter out empty lines
        .map(line => modifyLine(line)) // Modify each line
        .join('\n'); // Join modified lines back together

    // Write the modified content back to the file
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`Modified file: ${filePath}`);
}

// Function to process all .txt files in the folder
function processAllFiles(folderPath) {
    // Get all files in the folder
    const files = fs.readdirSync(folderPath);

    // Loop through each file and modify if it's a .txt file
    files.forEach(file => {
        if (path.extname(file) === '.txt') {
            const filePath = path.join(folderPath, file);
            modifyFileContent(filePath);
        }
    });
}

// Run the file modification process
processAllFiles(inputDir);
console.log('All .txt files have been modified.');
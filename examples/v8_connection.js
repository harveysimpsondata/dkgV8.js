require('dotenv').config({ path: '../.env' }); // Load environment variables from the .env file

const DKG = require('dkg.js'); // Load the DKG.js package

// Load environment variables

const OT_NODE_PORT = process.env.NODE_PORT;


const PUBLIC_KEY = "0x87803385D2bCe9cbc7c532AD7ab2B9C665C2023E"
const PRIVATE_KEY = "58c3328907229f8cfade1aa2801ece09406bbf1cff2c8bcea402504ba28a9049"
const OT_NODE_HOSTNAME = "http://134.122.115.137"

console.log('OT_NODE_HOSTNAME:', OT_NODE_HOSTNAME);
console.log('OT_NODE_PORT:', OT_NODE_PORT);
console.log('PUBLIC_KEY:', PUBLIC_KEY);
console.log('PRIVATE_KEY:', PRIVATE_KEY);


// Initialize DKG client with environment and blockchain configurations
const DkgClient = new DKG({
    environment: 'testnet',
    endpoint: OT_NODE_HOSTNAME,
    port: OT_NODE_PORT,
    blockchain: {
        name: 'base',
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
    },
    maxNumberOfRetries: 30,
    frequency: 2,
    contentType: 'all',
});

// Function to fetch node info
async function fetchNodeInfo() {
    try {
        const nodeInfo = await DkgClient.node.info(); // Get node info from the DKG client
        console.log('======================== NODE INFO RECEIVED');
        console.log(nodeInfo); // Display node info in the console
    } catch (error) {
        console.error('Error connecting to the node:', error); // Handle connection errors
    }
}

// Fetch and display node info
fetchNodeInfo();

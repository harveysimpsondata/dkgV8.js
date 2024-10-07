require('dotenv').config({ path: '../.env' }); // Load environment variables from the .env file

const DKG = require('dkg.js'); // Load the DKG.js package

// Load environment variables
const OT_NODE_HOSTNAME = process.env.NODE_HOSTNAME;
const OT_NODE_PORT = process.env.NODE_PORT;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

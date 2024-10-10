require('dotenv').config({ path: '../.env' }); // Path to the .env file from the examples folder

const DKG = require('dkg.js');
const axios = require('axios'); // You can use axios or node-fetch for making API requests

const OT_NODE_HOSTNAME = process.env.NODE_HOSTNAME;
const OT_NODE_PORT = process.env.NODE_PORT;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MARTA_API_KEY = process.env.MARTA;
const RPC_URI = process.env.BASE_TESTNET_URI
const node_hostname = process.env.NODE_HOSTNAME;
const node_port = process.env.NODE_PORT;
const rpc_uri = process.env.BASE_TESTNET_URI;
console.log(`RPC URI: ${rpc_uri} ${node_hostname}`);
const DkgClient = new DKG({
    environment: 'testnet',
    endpoint: OT_NODE_HOSTNAME,
    port: OT_NODE_PORT,
    blockchain: {
        name: 'base:84532',
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,

    },
    maxNumberOfRetries: 30,
    frequency: 2,
    contentType: 'all',
});



function divider() {
    console.log('==================================================');
    console.log('==================================================');
    console.log('==================================================');
}

async function fetchNodeInfo() {
    const nodeInfo = await DkgClient.node.info();
    console.log('======================== NODE INFO RECEIVED');
    console.log(nodeInfo);
}

fetchNodeInfo().catch(console.error);

// Function to fetch MARTA train data
async function fetchMartaData() {
    const url = "https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/traindata";

    try {
        const response = await axios.get(url, {
            params: {
                apiKey: MARTA_API_KEY
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Failed to fetch MARTA data. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching MARTA data:', error);
        return null;
    }
}

// Function to create a JSON-LD formatted knowledge asset
async function createKnowledgeAsset(data) {
    if (!data) {
        console.error('No MARTA data available');
        return;
    }

    // Create JSON-LD structure for the knowledge asset (like you did in Python)
    const jsonLdData = {
        "@context": {
            "@vocab": "http://schema.org/",
            "DESTINATION": "http://schema.org/destination",
            "DIRECTION": "http://schema.org/direction",
            "EVENT_TIME": "http://schema.org/eventTime",
            "IS_REALTIME": "http://schema.org/isRealtime",
            "LINE": "http://schema.org/line",
            "NEXT_ARR": "http://schema.org/nextArrival",
            "STATION": "http://schema.org/trainStation",
            "TRAIN_ID": "http://schema.org/trainID"
        },
        "@graph": []
    };

    // Process only the first 10 train events for simplicity (like in your Python code)
    for (const train of data.slice(0, 1)) {
        const trainEvent = {
            "@type": "TrainEvent",
            "DESTINATION": train.DESTINATION,
            "DIRECTION": train.DIRECTION,
            "EVENT_TIME": train.EVENT_TIME,
            "IS_REALTIME": train.IS_REALTIME,
            "LINE": train.LINE,
            "NEXT_ARR": train.NEXT_ARR,
            "STATION": train.STATION,
            "TRAIN_ID": train.TRAIN_ID
        };
        jsonLdData["@graph"].push(trainEvent);
    }

    // Print the formatted JSON-LD structure (for debugging)
    console.log('======================== JSON-LD DATA FORMATTED');
    console.log(JSON.stringify(jsonLdData, null, 2));

    // Format the assertions
    const assertions = await DkgClient.assertion.formatGraph({ public: jsonLdData });
    divider();
    console.log('======================== ASSERTIONS FORMATTED');
    console.log(JSON.stringify(assertions, null, 2));

    // Calculate Merkle Root
    const publicAssertionId = await DkgClient.assertion.getPublicAssertionId({ public: jsonLdData });
    divider();
    console.log('======================== PUBLIC ASSERTION ID (MERKLE ROOT) CALCULATED');
    console.log(publicAssertionId);

    // Get the size of the assertion
    const publicAssertionSize = await DkgClient.assertion.getSizeInBytes({ public: jsonLdData });
    divider();
    console.log('======================== PUBLIC ASSERTION SIZE CALCULATED');
    console.log(publicAssertionSize);

    // Get bid suggestion for asset creation
    const bidSuggestion = await DkgClient.network.getBidSuggestion(
        publicAssertionId,
        publicAssertionSize,
        { epochsNum: 1 }
    );
    divider();
    console.log('======================== BID SUGGESTION CALCULATED');
    console.log(bidSuggestion);

    // Increase the allowance if necessary
    const increaseAllowanceResult = await DkgClient.asset.increaseAllowance(bidSuggestion);
    divider();
    console.log('======================== ALLOWANCE INCREASED');
    console.log(increaseAllowanceResult);

    // Create the asset on the OriginTrail network
    const createAssetResult = await DkgClient.asset.create({ public: jsonLdData }, { epochsNum: 2 });
    divider();
    console.log('======================== ASSET CREATED');
    console.log(createAssetResult);

    return createAssetResult;
}

async function main() {
    // Step 1: Fetch MARTA data
    const martaData = await fetchMartaData();

    // Step 2: Create a knowledge asset from the MARTA data
    const asset = await createKnowledgeAsset(martaData);

    if (asset && asset.UAL) {
        console.log('======================== ASSET UAL RECEIVED');
        console.log(asset.UAL);
    } else {
        console.error('Failed to create knowledge asset');
    }
}

// Run the main function
main().catch(console.error);

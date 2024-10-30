const DKGClient = require("dkg.js");

const node_options = {
    environment: "testnet",
    endpoint: "http://134.122.115.137",
    port: "8900",
    useSSL: false,
    maxNumberOfRetries: 100,
};

const dkg = new DKGClient(node_options);

async function createAndTestParanet(ual) {
    try {
        const result = await dkg.paranet.create(ual, {
            paranetName: "testtest__paranet1",
            paranetDescription: "testtest_paranet",
            environment: "testnet",
            paranetNodesAccessPolicy: 0,
            paranetMinersAccessPolicy: 0,
            tracToNeuroEmissionMultiplier: 5,
            incentivizationProposalVotersRewardPercentage: 12.0,
            operatorRewardPercentage: 10.0,
            blockchain: {
                name: "base:84532",
                publicKey: "0x90Cfb4E446fE94F70A960eEEd66eBa129Ccc9bD4",
                privateKey: "b0d7bb9b3f568e7e2323795df6a7a6a4c46b6f4ce703a7a846a264aeb60808e8",
            },
        });

        if (result) {
            console.log('Paranet created successfully with UAL: ${result.paranet}');
        } else {
            console.log('Failed to create Paranet. No UAL returned.');
        }

    } catch (error) {
        console.error('Error creating Paranet:', error);
    }
}

const ual = 'did:dkg:base:84532/0xb8b904c73d2fb4d8c173298a51c27fab70222c32/6262907';
createAndTestParanet(ual);
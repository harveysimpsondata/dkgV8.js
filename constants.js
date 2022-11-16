/**
 * @constant {number} MAX_FILE_SIZE
 * - Max file size for publish
 */
module.exports.MAX_FILE_SIZE = 2621440;

/**
 * @constant {number} DID_PREFIX
 * - DID prefix for graph database
 */
module.exports.DID_PREFIX = "did:dkg";

/**
 * @constant {object} PUBLISH_TYPES
 * - Different types of publish
 */
module.exports.PUBLISH_TYPES = {
  ASSERTION: "assertion",
  ASSET: "asset",
  INDEX: "index",
};

module.exports.BLOCKCHAINS = {
  ganache: {
    rpc: "http://localhost:7545",
    hubContract: "0x209679fA3B658Cd0fC74473aF28243bfe78a9b12",
  },
  polygon: {
    rpc: "https://matic-mumbai.chainstacklabs.com",
    hubContract: "0xdaa16AC171CfE8Df6F79C06E7EEAb2249E2C9Ec8",
  },
  otp: {
    rpc: "wss://lofar.origin-trail.network",
    hubContract: "0xc9184C1A0CE150a882DC3151Def25075bdAf069C",
  },
};

module.exports.WEBSOCKET_PROVIDER_OPTIONS = {
  reconnect: {
    auto: true,
    delay: 1000, // ms
    maxAttempts: 3,
  },
  clientConfig: {
    keepalive: true,
    keepaliveInterval: 30 * 1000, // ms
  },
};

module.exports.PUBLISH_TRIPLES_NUMBER = 10;
module.exports.PUBLISH_CHUNKS_NUMBER = 10;
module.exports.PUBLISH_EPOCHS_NUM = 5;
module.exports.PUBLISH_TOKEN_AMOUNT = 15;

module.exports.VISIBILITY = {
  public: 1,
  private: 0,
};
module.exports.DEFAULT_PUBLISH_VISIBILITY = this.VISIBILITY.public;
module.exports.DEFAULT_COMMIT_OFFSET = 0;

module.exports.OPERATIONS = {
  publish: "publish",
  get: "get",
  update: "update",
};

module.exports.OPERATION_STATUSES = {
  pending: "PENDING",
  completed: "COMPLETED",
  failed: "FAILED",
};

module.exports.GET_OUTPUT_FORMATS = {
  N_QUADS: "n-quads",
  JSON_LD: "json-ld",
};

module.exports.OPERATIONS_STEP_STATUS = {
  INCREASE_ALLOWANCE_COMPLETED: 'INCREASE_ALLOWANCE_COMPLETED',
  CREATE_ASSET_COMPLETED: 'CREATE_ASSET_COMPLETED',
  NETWORK_PUBLISH_COMPLETED: 'NETWORK_PUBLISH_COMPLETED'
}

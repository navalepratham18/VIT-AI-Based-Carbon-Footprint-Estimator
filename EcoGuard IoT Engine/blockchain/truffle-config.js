require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { INFURA_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    sepolia: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, INFURA_API_KEY),
      network_id: 11155111,
      gas: 4465030,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 1000000, // Add this line
      pollingInterval: 15000         // Add this line
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin
    }
  }
};
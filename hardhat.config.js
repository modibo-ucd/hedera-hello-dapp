import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.HEX_PRIVATE_KEY;

export default {
  defaultNetwork: 'hardhat',
  networks: {
    hashio: {
      url: process.env.TESTNET_ENDPOINT,
      accounts: [PRIVATE_KEY],
      chainId: 296,
    },
  },
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: { timeout: 20000 },
};

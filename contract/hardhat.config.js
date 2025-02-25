const { HardhatUserConfig } = require('hardhat/config');
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.my_Alchemy;
const InFURA_API_KEY = process.env.Infura_key;
const alchemy_url = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const infura_url = `https://sepolia.infura.io/v3/${InFURA_API_KEY}`;
const public_rpc = 'https://ethereum-sepolia-rpc.publicnode.com';
const amoy_rpc = 'https://rpc-amoy.polygon.technology/';
const polygon_rpc = 'https://polygon-rpc.com';
// const public_rpc = 'https://endpoints.omniatech.io/v1/eth/sepolia/public';

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = process.env.Test_Secret;
const ETHERSCAN_APIKEY = process.env.Etherscan_Key;

const config = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: public_rpc,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-price-matic.txt',
    noColors: true,
    coinmarketcap: process.env.CoinMarketCap_API_Key,
    token: 'MATIC',
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY,
  },
  sourcify: {
    enabled: true,
  },
  allowUnlimitedContractSize: true,
};

module.exports = config;

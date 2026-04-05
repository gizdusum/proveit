require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERLINK_RPC_URL = process.env.ETHERLINK_RPC_URL || "https://node.shadownet.etherlink.com";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    etherlinkTestnet: {
      url: ETHERLINK_RPC_URL,
      chainId: 127823,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};

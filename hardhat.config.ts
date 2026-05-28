import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    ...(process.env.POLYGON_AMOY_RPC && process.env.PRIVATE_KEY ? {
      amoy: {
        type: "http" as const,
        chainType: "l1" as const,
        url: process.env.POLYGON_AMOY_RPC,
        accounts: [process.env.PRIVATE_KEY],
        gas: 2000000,
        gasPrice: 25000000000,
      }
    } : {}),
  },
});
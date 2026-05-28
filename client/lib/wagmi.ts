import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// Configure chains based on environment
const chains = [hardhat, sepolia, mainnet] as const;

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545', {
      timeout: 10_000,
    }),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  // Set hardhat as the default chain
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

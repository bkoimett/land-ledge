# Smart Contract Integration Guide

## Overview

The frontend is now fully integrated with the LandRegistry smart contract using wagmi and viem libraries.

## Setup

### 1. Contract Configuration

The contract ABI and address are configured in:
- `lib/abi/LandRegistry.json` - Contract ABI
- `lib/contract.ts` - Contract address and exports
- `lib/wagmi.ts` - Wagmi configuration with chains (Hardhat, Sepolia, Mainnet)

### 2. Web3 Provider

The `Web3Provider` wraps the entire app in `app/layout.tsx` to provide:
- Wagmi context for wallet connections
- React Query for caching contract reads

### 3. Wallet Connection

The `WalletConnect` component in the Navbar allows users to:
- Connect their MetaMask or injected wallet
- View their connected address
- Disconnect their wallet

## Features

### Register Land (`/register`)
- Auto-fills wallet address when connected
- Converts area units (acres, hectares, sqft) to square meters
- Calls `registerLand(landId, location, areaSqMeters)` on the contract
- Shows transaction status and hash

### Transfer Ownership (`/transfer`)
- Auto-fills current owner from connected wallet
- Validates receiver address format
- Calls `transferOwnership(landId, newOwner)` on the contract
- Shows transaction confirmation

### Verify Ownership (`/verify`)
- Reads land details from contract using `getLandDetails(landId)`
- Displays current owner, location, and area
- Shows if land is not registered

### View History (`/history`)
- Reads ownership history using `getHistory(landId)`
- Displays timeline of all ownership changes
- Shows registration and transfer events

## Custom Hooks

Located in `hooks/useLandRegistry.ts`:

- `useRegisterLand()` - Register new land
- `useTransferOwnership()` - Transfer land ownership
- `useGetLandDetails(landId)` - Read land details
- `useGetOwner(landId)` - Get current owner
- `useGetHistory(landId)` - Get ownership history

## Running Locally

1. Start Hardhat node:
```bash
npx hardhat node
```

2. Deploy contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Update contract address in `client/lib/contract.ts`

4. Start frontend:
```bash
cd client
npm run dev
```

5. Connect MetaMask to localhost:8545 and import a test account

## Network Configuration

The app supports:
- **Hardhat** (localhost:8545) - for local development
- **Sepolia** - for testnet deployment
- **Mainnet** - for production

Switch networks in your wallet to interact with different deployments.

## Environment Variables (Optional)

Create `.env.local` in the client directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=31337
```

## Troubleshooting

- **Wallet not connecting**: Ensure MetaMask is installed and unlocked
- **Transaction failing**: Check you're on the correct network
- **Contract not found**: Verify the contract address in `lib/contract.ts`
- **Read errors**: Ensure the land ID exists on the blockchain

# ArdhiChain Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   MetaMask   │◄────────┤  Next.js App │                  │
│  │   Wallet     │         │  (Frontend)  │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │  Sign Transactions     │  Read/Write              │
│         │                        │                           │
└─────────┼────────────────────────┼───────────────────────────┘
          │                        │
          │                        │
          ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Ethereum Network                          │
│                   (Hardhat/Sepolia/Mainnet)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              ┌──────────────────────────┐                    │
│              │   LandRegistry Contract  │                    │
│              │                          │                    │
│              │  • registerLand()        │                    │
│              │  • transferOwnership()   │                    │
│              │  • getLandDetails()      │                    │
│              │  • getHistory()          │                    │
│              └──────────────────────────┘                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
client/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Web3Provider
│   ├── page.tsx                 # Home page
│   ├── register/page.tsx        # Register land
│   ├── transfer/page.tsx        # Transfer ownership
│   ├── verify/page.tsx          # Verify ownership
│   └── history/page.tsx         # View history
│
├── components/
│   ├── forms/
│   │   ├── RegisterForm.tsx     # Land registration form
│   │   └── TransferForm.tsx     # Ownership transfer form
│   ├── layout/
│   │   ├── Navbar.tsx           # Navigation with WalletConnect
│   │   └── Footer.tsx           # Footer component
│   └── ui/
│       ├── WalletConnect.tsx    # Wallet connection button
│       ├── OwnershipCard.tsx    # Display land details
│       ├── TimelineItem.tsx     # History timeline item
│       └── ...
│
├── hooks/
│   └── useLandRegistry.ts       # Custom contract hooks
│       ├── useRegisterLand()
│       ├── useTransferOwnership()
│       ├── useGetLandDetails()
│       ├── useGetOwner()
│       └── useGetHistory()
│
├── lib/
│   ├── abi/
│   │   └── LandRegistry.json    # Contract ABI
│   ├── contract.ts              # Contract address & config
│   ├── wagmi.ts                 # Wagmi configuration
│   └── utils.ts                 # Helper functions
│
└── providers/
    └── Web3Provider.tsx         # Wagmi & React Query provider
```

## Data Flow Diagrams

### Registration Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Fill form
     ▼
┌─────────────────┐
│ RegisterForm    │
│ Component       │
└────┬────────────┘
     │ 2. Validate input
     ▼
┌─────────────────┐
│ useRegisterLand │
│ Hook            │
└────┬────────────┘
     │ 3. Call writeContract
     ▼
┌─────────────────┐
│ wagmi           │
│ writeContract   │
└────┬────────────┘
     │ 4. Request signature
     ▼
┌─────────────────┐
│ MetaMask        │
│ Popup           │
└────┬────────────┘
     │ 5. User approves
     ▼
┌─────────────────┐
│ Ethereum        │
│ Network         │
└────┬────────────┘
     │ 6. Transaction mined
     ▼
┌─────────────────┐
│ LandRegistry    │
│ Contract        │
│ • Store data    │
│ • Emit event    │
└────┬────────────┘
     │ 7. Confirmation
     ▼
┌─────────────────┐
│ UI Update       │
│ • Show success  │
│ • Display hash  │
└─────────────────┘
```

### Verification Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Enter Land ID
     ▼
┌─────────────────┐
│ Verify Page     │
└────┬────────────┘
     │ 2. Trigger search
     ▼
┌─────────────────┐
│useGetLandDetails│
│ Hook            │
└────┬────────────┘
     │ 3. Call readContract
     ▼
┌─────────────────┐
│ React Query     │
│ Cache Check     │
└────┬────────────┘
     │ 4. If not cached
     ▼
┌─────────────────┐
│ wagmi           │
│ readContract    │
└────┬────────────┘
     │ 5. RPC call
     ▼
┌─────────────────┐
│ Ethereum        │
│ Network         │
└────┬────────────┘
     │ 6. Query contract
     ▼
┌─────────────────┐
│ LandRegistry    │
│ Contract        │
│ • Read storage  │
└────┬────────────┘
     │ 7. Return data
     ▼
┌─────────────────┐
│ UI Display      │
│ • Owner info    │
│ • Location      │
│ • Area size     │
└─────────────────┘
```

## Smart Contract Structure

```
LandRegistry Contract
│
├── Structs
│   ├── LandDetails
│   │   ├── bytes32 landId
│   │   ├── address currentOwner
│   │   ├── string location
│   │   ├── uint256 areaSqMeters
│   │   └── bool exists
│   │
│   └── OwnerRecord
│       ├── address owner
│       ├── uint256 timestamp
│       └── string action
│
├── Storage
│   ├── mapping(bytes32 => LandDetails) lands
│   └── mapping(bytes32 => OwnerRecord[]) ownershipHistory
│
├── Events
│   ├── LandRegistered(landId, owner, location, timestamp)
│   └── OwnershipTransferred(landId, previousOwner, newOwner, timestamp)
│
├── Write Functions
│   ├── registerLand(landId, location, areaSqMeters)
│   └── transferOwnership(landId, newOwner)
│
└── Read Functions
    ├── getLandDetails(landId) → LandDetails
    ├── getOwner(landId) → address
    └── getHistory(landId) → OwnerRecord[]
```

## Technology Stack

### Blockchain Layer
```
┌─────────────────────────────────┐
│ Solidity ^0.8.20                │
│ • Smart contract language       │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Hardhat 3                       │
│ • Development environment       │
│ • Testing framework             │
│ • Deployment tools              │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Ethereum Network                │
│ • Hardhat (local)               │
│ • Sepolia (testnet)             │
│ • Mainnet (production)          │
└─────────────────────────────────┘
```

### Frontend Layer
```
┌─────────────────────────────────┐
│ Next.js 16 + React 19           │
│ • Server & client components    │
│ • App Router                    │
│ • TypeScript                    │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ wagmi 3 + viem 2                │
│ • React hooks for Ethereum      │
│ • Type-safe contract calls      │
│ • Wallet connection             │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ @tanstack/react-query           │
│ • Data fetching & caching       │
│ • Automatic refetching          │
│ • Loading states                │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ TailwindCSS 4                   │
│ • Utility-first styling         │
│ • Responsive design             │
│ • Custom components             │
└─────────────────────────────────┘
```

## Network Configuration

```
┌──────────────────────────────────────────────────────────┐
│                    Wagmi Config                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Hardhat Local  │  │     Sepolia     │              │
│  │                 │  │                 │              │
│  │ Chain ID: 31337 │  │ Chain ID: 11155111            │
│  │ RPC: localhost  │  │ RPC: Infura/Alchemy           │
│  │ For: Development│  │ For: Testing    │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                          │
│  ┌─────────────────┐                                    │
│  │    Mainnet      │                                    │
│  │                 │                                    │
│  │ Chain ID: 1     │                                    │
│  │ RPC: Infura     │                                    │
│  │ For: Production │                                    │
│  └─────────────────┘                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Smart Contract Level                                │
│     • Ownership checks (msg.sender)                     │
│     • Duplicate registration prevention                 │
│     • Address validation                                │
│                                                          │
│  2. Frontend Validation                                 │
│     • Input format validation                           │
│     • Ethereum address validation                       │
│     • Land ID format checks                             │
│                                                          │
│  3. Wallet Level                                        │
│     • User must approve transactions                    │
│     • Private key never exposed                         │
│     • MetaMask security                                 │
│                                                          │
│  4. Network Level                                       │
│     • Blockchain immutability                           │
│     • Consensus mechanism                               │
│     • Cryptographic signatures                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Developer Machine
├── Hardhat Node (localhost:8545)
├── Smart Contract
└── Next.js Dev Server (localhost:3000)
```

### Production
```
┌─────────────────────────────────────────┐
│         Ethereum Mainnet                │
│    (Smart Contract Deployed)            │
└─────────────────────────────────────────┘
                 ▲
                 │
                 │ RPC Calls
                 │
┌─────────────────────────────────────────┐
│      Vercel/Netlify/AWS                 │
│    (Next.js Frontend Hosted)            │
└─────────────────────────────────────────┘
                 ▲
                 │
                 │ HTTPS
                 │
┌─────────────────────────────────────────┐
│          User Browser                   │
│    (MetaMask + Web Interface)           │
└─────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                   Application State                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Wallet State    │  │  Contract State  │            │
│  │  (wagmi)         │  │  (React Query)   │            │
│  │                  │  │                  │            │
│  │ • address        │  │ • land details   │            │
│  │ • isConnected    │  │ • history        │            │
│  │ • chainId        │  │ • cached reads   │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Form State      │  │  UI State        │            │
│  │  (React)         │  │  (React)         │            │
│  │                  │  │                  │            │
│  │ • input values   │  │ • loading        │            │
│  │ • validation     │  │ • errors         │            │
│  │ • errors         │  │ • modals         │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Decentralized data storage
- ✅ Immutable records
- ✅ User-controlled transactions
- ✅ Type-safe development
- ✅ Efficient data caching
- ✅ Responsive UI
- ✅ Multi-network support

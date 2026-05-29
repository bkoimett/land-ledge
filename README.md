# ArdhiChain 🌍

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Zone01-Kisumu%20Blockchain%20Hackathon-brightgreen)](https://github.com)
[![Polygon](https://img.shields.io/badge/Polygon-Amoy-purple)](https://polygon.technology/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-blue)](https://soliditylang.org/)

> **Trust on the chain. Ownership in your hands.**

**ArdhiChain** is a blockchain-based land registry system built during the Zone01 Kisumu 48-hour Hackathon (28th-29th May). It enables immutable land registration, transparent ownership transfers, and a verifiable history timeline—solving land fraud and title disputes in Kenya and across Africa.

---

## 📌 The Problem

Land fraud, double allocation, and disputed ownership cost Kenyans billions annually. Paper records are easily forged, centralized databases can be manipulated, and citizens have no transparent way to verify a property's true ownership history.

**ArdhiChain solves this by making land records immutable, transparent, and publicly verifiable.**

---

## 🎯 Our Solution

A web3 platform where:
- ✅ **Register land** on-chain with unique Land IDs
- ✅ **Transfer ownership** securely between wallets
- ✅ **Verify ownership** instantly by searching any Land ID
- ✅ **View full provenance timeline** — every owner, every transfer, forever

No central authority can alter history. No duplicate titles. Complete trust.

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Smart Contract     │────▶│  Polygon Amoy   │
│  (Frontend UI)  │     │  LandRegistry.sol   │     │    Testnet      │
└─────────────────┘     └─────────────────────┘     └─────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌─────────────────┐     ┌─────────────────────┐
│   MetaMask      │     │  Go API (Optional)  │
│   Wallet Conn.  │     │  Event Listener     │
└─────────────────┘     └─────────────────────┘
```

---

## 👥 Team & Roles

| Role | Team Member | Responsibility |
|------|-------------|----------------|
| **Frontend Lead** | Benjamin Koimett | React/Next.js UI, wallet connection, timeline view |
| **Smart Contract Engineer** | Clare Gisore | Solidity contract, deployment to testnet, immutability |
| **Backend / Go Engineer** | Alphonce Oyunga | Gin API, event listening, optional caching |
| **Integration Engineer** | Victoria Janet | Web3 glue (ethers.js/wagmi), contract ↔ UI binding |
| **Product + Pitch Lead** | John Kagunda | Storytelling, demo script, slides, branding |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI |
| **Blockchain** | Solidity, Hardhat/Foundry, Polygon Amoy Testnet |
| **Web3 Library** | ethers.js / wagmi + RainbowKit |
| **Wallet** | MetaMask |
| **Backend (optional)** | Go, Gin, go-ethereum, PostgreSQL |
| **Verification** | Polygonscan / Etherscan |

---

## 🚀 Features

### Core Features (All working on testnet)
- [x] MetaMask wallet connection
- [x] Register land (Land ID, Location, Area, Owner)
- [x] Transfer ownership to another wallet
- [x] Verify ownership by Land ID
- [x] View complete ownership history timeline
- [x] Immutable on-chain records

### Demo-Ready UI
- [x] Clean, professional dashboard
- [x] Loading & transaction states
- [x] Error handling (wrong network, rejected tx)
- [x] Responsive design

---

## 📋 Live Demo Flow

> **We have pre-registered mock data on Polygon Amoy to save time.**

1. **Connect Wallet** — Click "Connect MetaMask" (switch to Amoy network)
2. **Register Land** — Enter Land ID `KSM-001`, Location `Kisumu CBD`, Area `0.25 acres`
3. **Verify** — Search `KSM-001` → shows current owner
4. **Transfer** — Transfer to another wallet address
5. **View Timeline** — See full history: Registration → Transfer → New Owner
6. **Re-verify** — Confirm new owner in < 30 seconds

---

## 🧪 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask extension
- Polygon Amoy testnet MATIC (from [faucet](https://faucet.polygon.technology/))

### Clone & Install

```bash
git clone https://github.com/your-team/ardhichain.git
cd ardhichain

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your contract address and RPC URL

# Run development server
npm run dev
```

### Smart Contract Deployment

```bash
cd contract
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network amoy
```

### Go Backend (Optional)

```bash
cd backend
go mod tidy
go run main.go
```

---

## 📁 Project Structure

```
ardhichain/
├── app/                    # Next.js App Router
│   ├── components/         # UI components
│   ├── hooks/             # Web3 hooks
│   ├── utils/             # Contract interaction
│   └── pages/             # Dashboard pages
├── contract/
│   ├── contracts/         # LandRegistry.sol
│   ├── scripts/           # Deployment scripts
│   └── test/              # Unit tests
├── backend/               # Go API (optional)
└── public/                # Static assets
```

---

## 🔗 Smart Contract Functions

```solidity
// Register new land
function registerLand(string memory landId, string memory location, string memory area) external

// Transfer ownership
function transferOwnership(string memory landId, address newOwner) external

// Get current owner
function getOwner(string memory landId) external view returns (address)

// Get full history
function getHistory(string memory landId) external view returns (HistoryEntry[] memory)
```

**Events emitted:** `LandRegistered`, `OwnershipTransferred`

**Deployed Contract (Polygon Amoy):** `0x...` (see `.env.local`)

---

## 📊 Judging Criteria Alignment

| Criteria | How ArdhiChain Delivers |
|----------|------------------------|
| **Innovation (30%)** | First land registry with full immutable provenance timeline for Kenyan context |
| **Technical Execution (30%)** | Fully functional prototype, clean code, proper use of smart contract events |
| **Real-world Impact (25%)** | Solves land fraud affecting millions; applicable to county governments |
| **Presentation (15%)** | 3-minute demo with pre-loaded data, clear storytelling |

---

## 🎤 Pitch Script (3 Minutes)

**Opening (30 sec):**  
> *"Land is the most valuable asset most Kenyans will ever own. Yet every year, families lose their homes to fraud and double allocation."*

**Problem (30 sec):**  
> *"Paper records burn. Databases get hacked. But blockchain is immutable."*

**Solution (45 sec):**  
> *"ArdhiChain — register land once. Ownership history is permanent. Transfer in seconds."*

**Demo (60 sec):**  
> *[Live demo: Connect wallet → Register → Transfer → Show timeline → Verify]*

**Impact (15 sec):**  
> *"No more fraud. No more disputes. Trust on the chain."*

---

## 🚧 Future Roadmap

- [ ] Integration with Kenyan ArdhiSasa digital land registry
- [ ] Mobile app with offline capability
- [ ] Biometric verification for landowners
- [ ] Layer 2 scaling for lower fees
- [ ] Government dashboard for bulk registrations

---

## 🙏 Acknowledgments

- Zone01 Kisumu for organizing the hackathon
- Polygon for testnet infrastructure
- Open source community: ethers.js, Hardhat, wagmi

---

## 📄 License

MIT © ArdhiChain Team 2026

---

## 📬 Contact

**Team ArdhiChain** — Zone01 Kisumu, Lake Basin Mall  
*28th-29th May 2026*

---

> **"On-Chain Hackathon — 48 hours. One problem. One solution. No borders."**

---

# ArdhiChain - Blockchain Land Registry

A decentralized land registry system built on Ethereum blockchain, providing secure, transparent, and immutable land ownership records.

## 🌟 Features

- **Register Land**: Record new land ownership on the blockchain
- **Transfer Ownership**: Securely transfer land to new owners
- **Verify Ownership**: Instantly verify current land ownership
- **View History**: Complete ownership history timeline
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets

## 🏗️ Architecture

### Smart Contract
- **LandRegistry.sol**: Solidity smart contract managing land records
- Stores land details, ownership, and complete history
- Deployed on Ethereum-compatible networks

### Frontend
- **Next.js 16**: React framework with App Router
- **wagmi & viem**: Ethereum interaction libraries
- **TailwindCSS**: Styling and UI components
- **TypeScript**: Type-safe development

---

## 🚀 Complete Setup Guide

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** and npm installed ([Download](https://nodejs.org/))
- **MetaMask** browser extension installed ([Download](https://metamask.io/download/))
- **Git** installed ([Download](https://git-scm.com/downloads))

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd land-ledge
```

### Step 2: Install Root Dependencies

```bash
npm install
```

This installs Hardhat and blockchain development tools.

### Step 3: Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

This installs Next.js and frontend libraries.

---

## 🔧 Running the Application

You need **THREE terminals** running simultaneously:

### Terminal 1: Start Hardhat Blockchain Node

```bash
npx hardhat node
```

**What this does:**
- Starts a local Ethereum blockchain at `http://127.0.0.1:8545`
- Creates 20 test accounts with 10,000 ETH each
- Displays account addresses and private keys

**Keep this terminal running!** You'll see transaction logs here.

**Copy one of the private keys** - you'll need it for MetaMask (Step 6).

---

### Terminal 2: Deploy Smart Contract

**Wait for Terminal 1 to be running**, then in a new terminal:

```bash
npm run deploy:local
```

**What this does:**
- Compiles the LandRegistry smart contract
- Deploys it to your local blockchain
- Saves the contract address to `deployments/contract.json`

**Expected output:**
```
Deploying with: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
LandRegistry deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

Then update the frontend with the contract address:

```bash
npm run update-frontend
```

**Expected output:**
```
✅ Frontend contract address updated successfully!
```

---

### Terminal 3: Start Frontend Development Server

```bash
cd client
npm run dev
```

**What this does:**
- Starts Next.js development server
- Frontend available at `http://localhost:3000`

**Expected output:**
```
▲ Next.js 16.2.6
- Local:        http://localhost:3000
```

**Keep this terminal running!**

---

## 🦊 MetaMask Configuration

### Step 4: Add Hardhat Local Network to MetaMask

1. Open MetaMask extension
2. Click the network dropdown (top left)
3. Click **"Add Network"** → **"Add a network manually"**
4. Enter these details:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
5. Click **"Save"**

### Step 5: Import Test Account

1. In MetaMask, click your account icon (top right)
2. Click **"Import Account"**
3. Paste one of the **private keys** from Terminal 1 (Hardhat node output)
4. Click **"Import"**

You should now see **10,000 ETH** in your account!

### Step 6: Switch to Hardhat Local Network

1. Click the network dropdown in MetaMask
2. Select **"Hardhat Local"**

---

## 🎯 Using the Application

### Step 7: Open the Application

Open your browser and go to: **http://localhost:3000**

### Step 8: Connect Your Wallet

1. Click **"Connect Wallet"** button in the top right
2. MetaMask will pop up
3. Click **"Next"** → **"Connect"**
4. Your wallet address should now appear in the navbar

### Step 9: Register Land

1. Click **"Register"** in the navigation menu
2. Fill in the form:
   - **Land ID:** `KE-001` (alphanumeric only, no spaces)
   - **Location:** `Nairobi, Karen District`
   - **Area Size:** `5.5`
   - **Unit:** `Acres`
   - **Owner Name:** `John Doe`
   - **Owner Wallet:** (auto-filled from connected wallet)
3. Click **"Register Land on Blockchain"**
4. MetaMask will pop up - click **"Confirm"**
5. Wait for transaction confirmation (should be instant on local network)
6. You'll see a success message with transaction hash!

### Step 10: Verify Land Ownership

1. Click **"Verify"** in the navigation menu
2. Enter the Land ID you just registered: `KE-001`
3. Click **"Search"**
4. You should see the land details displayed:
   - Current owner address
   - Location
   - Area size
   - Registration date

### Step 11: View Ownership History

1. Click **"History"** in the navigation menu
2. Enter the Land ID: `KE-001`
3. Click **"Search"**
4. You'll see a timeline showing:
   - Registration event
   - Owner address
   - Timestamp

### Step 12: Transfer Ownership (Optional)

1. Click **"Transfer"** in the navigation menu
2. Enter:
   - **Land ID:** `KE-001`
   - **New Owner Address:** (use another test account address from Terminal 1)
3. Click **"Transfer Ownership"**
4. Confirm in MetaMask
5. Check the history page to see the transfer recorded!

---

## 🔄 Restarting After Shutdown

If you stop the Hardhat node and need to restart:

### 1. Start Hardhat Node
```bash
npx hardhat node
```

### 2. Redeploy Contract
```bash
npm run deploy:local
npm run update-frontend
```

### 3. Reset MetaMask
- Open MetaMask → Settings → Advanced
- Click **"Clear activity tab data"**
- This resets transaction history and nonces

### 4. Start Frontend
```bash
cd client
npm run dev
```

---

## 🧪 Testing

Run smart contract tests:

```bash
npx hardhat test
```

Run specific test file:

```bash
npx hardhat test test/LandRegistry.test.js
```

---

## 📁 Project Structure

```
land-ledge/
├── contracts/              # Solidity smart contracts
│   └── LandRegistry.sol   # Main land registry contract
├── test/                   # Contract tests
│   └── LandRegistry.test.js
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js          # Contract deployment
│   └── update-frontend-address.js
├── client/                 # Next.js frontend application
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Home page
│   │   ├── register/      # Land registration page
│   │   ├── verify/        # Ownership verification page
│   │   ├── transfer/      # Ownership transfer page
│   │   └── history/       # History timeline page
│   ├── components/        # React components
│   │   ├── forms/         # Form components
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   │   └── useLandRegistry.ts
│   ├── lib/               # Utilities and config
│   │   ├── contract.ts    # Contract address & ABI
│   │   ├── wagmi.ts       # Web3 configuration
│   │   └── utils.ts       # Helper functions
│   └── providers/         # Context providers
│       └── Web3Provider.tsx
├── deployments/           # Deployment artifacts
│   └── contract.json      # Deployed contract address
├── hardhat.config.ts      # Hardhat configuration
└── package.json           # Dependencies and scripts
```

---

## 🔧 Smart Contract Functions

### Write Functions (Require Gas)
- `registerLand(landId, location, areaSqMeters)` - Register new land
- `transferOwnership(landId, newOwner)` - Transfer ownership

### Read Functions (Free)
- `getLandDetails(landId)` - Get complete land information
- `getOwner(landId)` - Get current owner address
- `getHistory(landId)` - Get ownership history

---

## 🐛 Troubleshooting

### Issue: "Please connect your wallet first"
**Solution:** Click "Connect Wallet" in the navbar and approve in MetaMask

### Issue: "Transaction failed"
**Solution:** 
- Ensure you're on Hardhat Local network (Chain ID 31337)
- Check Hardhat node is running in Terminal 1
- Verify you have test ETH

### Issue: "Land not registered" when searching
**Solution:**
- Make sure you registered the land first
- Check you're using the exact same Land ID (case-sensitive)
- Verify contract address is correct in `client/lib/contract.ts`

### Issue: "ERR_CONNECTION_REFUSED"
**Solution:** Hardhat node is not running - start it in Terminal 1

### Issue: "Nonce too high" error
**Solution:** Reset MetaMask account:
- Settings → Advanced → Clear activity tab data

### Issue: Contract address mismatch
**Solution:**
```bash
npm run update-frontend
```
Then refresh browser (Ctrl+Shift+R)

---

## 🌐 Deploying to Testnet (Sepolia)

### 1. Get Sepolia ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Enter your wallet address
- Request test ETH

### 2. Configure Environment
Create `.env` file in root:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
```

### 3. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
npm run update-frontend
```

### 4. Update Frontend Config
In `client/lib/wagmi.ts`, ensure Sepolia is configured.

### 5. Add Sepolia Network to MetaMask
- Network Name: `Sepolia`
- RPC URL: `https://sepolia.infura.io/v3/YOUR_KEY`
- Chain ID: `11155111`
- Currency: `ETH`

---

## 🛠️ Tech Stack

**Blockchain**
- Solidity ^0.8.20
- Hardhat 3.6.0
- ethers.js v6.16.0

**Frontend**
- Next.js 16.2.6
- React 19.2.4
- TypeScript 5
- wagmi 3.6.16
- viem 2.51.3
- TailwindCSS 4

---

## 📚 Additional Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick reference guide
- [INTEGRATION.md](client/INTEGRATION.md) - Frontend integration details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with Hardhat development environment
- UI inspired by modern Web3 applications
- Blockchain technology for immutable records

---

## 📞 Support

If you encounter any issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Open an issue on GitHub

---

**Happy Building! 🚀**

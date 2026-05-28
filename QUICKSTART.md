# ArdhiChain Quick Start Guide

## 🎯 Goal
Get the land registry dApp running locally in 5 minutes.

## ⚡ Fast Setup

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Start Blockchain
```bash
# Terminal 1
npx hardhat node
```
Keep this running. You'll see test accounts with private keys.

### 3. Deploy Contract
```bash
# Terminal 2
npx hardhat run scripts/deploy.js --network localhost
node scripts/update-frontend-address.js
```

### 4. Start Frontend
```bash
# Terminal 2 (or Terminal 3)
cd client
npm run dev
```

### 5. Configure MetaMask

**Add Network:**
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency: ETH

**Import Account:**
Copy a private key from Terminal 1 (Hardhat node output) and import it into MetaMask.

### 6. Use the App

Open http://localhost:3000

1. Click "Connect Wallet" in navbar
2. Select your imported account
3. Try registering a land plot!

## 🧪 Test Data

Use these for testing:

**Land IDs:**
- KE-001
- PLOT-2024-001
- NAIROBI-123

**Locations:**
- Nairobi, Karen District
- Mombasa, Nyali Area
- Kisumu, Milimani Estate

**Area Sizes:**
- 5.5 acres
- 2.3 hectares
- 50000 sqft

## 🔍 Verify It Works

1. **Register Land**: Go to /register, fill form, submit
2. **Check Transaction**: Look for transaction hash in success message
3. **Verify Ownership**: Go to /verify, search your land ID
4. **View History**: Go to /history, see the registration event

## 🐛 Troubleshooting

**"Please connect your wallet first"**
- Click "Connect Wallet" in navbar
- Approve connection in MetaMask

**"Transaction failed"**
- Check you're on Hardhat Local network (Chain ID 31337)
- Ensure Hardhat node is running
- Check you have test ETH

**"Land already registered"**
- Use a different Land ID
- Each ID can only be registered once

**Contract address mismatch**
- Run: `node scripts/update-frontend-address.js`
- Restart frontend: `cd client && npm run dev`

**MetaMask shows wrong balance**
- Reset account in MetaMask settings
- Or use a different test account

## 📝 Common Commands

```bash
# Restart everything
pkill -f hardhat  # Stop Hardhat node
npx hardhat node  # Start fresh node
npx hardhat run scripts/deploy.js --network localhost
node scripts/update-frontend-address.js

# Run tests
npx hardhat test

# Check contract
npx hardhat console --network localhost
> const LandRegistry = await ethers.getContractFactory("LandRegistry")
> const contract = await LandRegistry.attach("CONTRACT_ADDRESS")
> await contract.getOwner("KE-001")
```

## 🎓 Next Steps

- Read [INTEGRATION.md](client/INTEGRATION.md) for technical details
- Explore the smart contract in `contracts/LandRegistry.sol`
- Check out the frontend code in `client/`
- Deploy to testnet (see README.md)

## 💡 Tips

- Use Chrome/Brave for best MetaMask experience
- Keep Hardhat node terminal visible to see transactions
- Each page refresh requires wallet reconnection
- Test accounts have 10,000 ETH each
- Transactions are instant on local network

Happy building! 🚀

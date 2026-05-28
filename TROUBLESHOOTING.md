# Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Wallet Connection Issues

#### "Please connect your wallet first"
**Cause:** Wallet not connected to the dApp

**Solution:**
1. Click "Connect Wallet" button in navbar
2. Select MetaMask in the popup
3. Approve the connection request
4. Ensure you're on the correct network

#### Wallet connects but shows wrong network
**Cause:** MetaMask is on a different network

**Solution:**
1. Open MetaMask
2. Click network dropdown at top
3. Select "Hardhat Local" (or your target network)
4. Refresh the page

#### Can't find Hardhat Local network in MetaMask
**Cause:** Network not added to MetaMask

**Solution:**
Add network manually:
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

### 🔴 Transaction Issues

#### "Transaction failed" or "User rejected transaction"
**Cause:** Multiple possible reasons

**Solutions:**
1. **Check network:** Ensure MetaMask is on correct network
2. **Check balance:** Ensure you have enough ETH for gas
3. **Check Hardhat node:** Ensure `npx hardhat node` is running
4. **Reset account:** MetaMask Settings → Advanced → Reset Account
5. **Try again:** Sometimes transactions just need a retry

#### Transaction stuck as "pending"
**Cause:** Nonce mismatch or network issues

**Solution:**
1. Reset MetaMask account (Settings → Advanced → Reset Account)
2. Restart Hardhat node
3. Redeploy contract
4. Update frontend address

#### "Land already registered" error
**Cause:** Land ID already exists on blockchain

**Solution:**
- Use a different Land ID
- Each ID can only be registered once
- Check if you already registered this ID

#### "Not the owner" error on transfer
**Cause:** Connected wallet is not the current owner

**Solution:**
1. Verify you're connected with the owner's wallet
2. Check current owner with Verify page
3. Switch to correct MetaMask account

### 🔴 Contract Issues

#### "Contract not found" or "Invalid address"
**Cause:** Contract address mismatch

**Solution:**
```bash
# Update frontend with latest deployment
node scripts/update-frontend-address.js

# Or manually check
cat deployments/contract.json
# Copy address to client/lib/contract.ts
```

#### Contract functions not working
**Cause:** ABI mismatch or outdated contract

**Solution:**
```bash
# Recompile and redeploy
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
node scripts/update-frontend-address.js

# Restart frontend
cd client
npm run dev
```

### 🔴 Frontend Issues

#### "Module not found" errors
**Cause:** Missing dependencies

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript errors
**Cause:** Type mismatches or missing types

**Solution:**
```bash
cd client
npm install --save-dev @types/node @types/react @types/react-dom
```

#### Page shows "Loading..." forever
**Cause:** RPC connection issue or wrong network

**Solution:**
1. Check browser console for errors
2. Verify Hardhat node is running
3. Check MetaMask network
4. Try refreshing the page

#### Styles not loading
**Cause:** TailwindCSS build issue

**Solution:**
```bash
cd client
rm -rf .next
npm run dev
```

### 🔴 Development Environment Issues

#### Hardhat node crashes or stops
**Cause:** Port conflict or process issue

**Solution:**
```bash
# Kill existing processes
pkill -f hardhat

# Or on Windows
taskkill /F /IM node.exe

# Restart
npx hardhat node
```

#### Port 3000 already in use
**Cause:** Another process using the port

**Solution:**
```bash
# Use different port
cd client
PORT=3001 npm run dev

# Or kill process on port 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### "Cannot find module" in scripts
**Cause:** Wrong Node.js version or missing dependencies

**Solution:**
```bash
# Check Node version (should be 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 🔴 Data Issues

#### Land details not showing after registration
**Cause:** Transaction not confirmed or cache issue

**Solution:**
1. Wait a few seconds for transaction confirmation
2. Refresh the page
3. Check transaction on Hardhat node logs
4. Verify with the land ID on Verify page

#### History shows incomplete data
**Cause:** Contract state or query issue

**Solution:**
1. Ensure land ID is correct
2. Check Hardhat node logs for events
3. Try a different land ID that you know exists

#### Area size shows wrong units
**Cause:** Conversion issue

**Solution:**
- Contract stores in square meters
- Frontend converts to acres/hectares/sqft
- Check `lib/utils.ts` conversion factors

### 🔴 MetaMask Specific Issues

#### MetaMask shows "Nonce too high"
**Solution:**
```
MetaMask → Settings → Advanced → Reset Account
```

#### MetaMask shows wrong balance
**Solution:**
1. Reset account (see above)
2. Or switch to different account and back
3. Or restart MetaMask

#### MetaMask not detecting network change
**Solution:**
1. Manually switch network in MetaMask
2. Refresh the page
3. Reconnect wallet

### 🔴 Testing Issues

#### Test accounts have no ETH
**Cause:** Using wrong network or account

**Solution:**
- Hardhat local accounts start with 10,000 ETH
- Import a test account from Hardhat node output
- Check you're on localhost:8545 network

#### Can't import Hardhat test account
**Solution:**
1. Copy private key from Hardhat node terminal
2. MetaMask → Import Account → Private Key
3. Paste the key (with or without 0x prefix)

## 🔍 Debugging Tips

### Check Hardhat Node Logs
```bash
# Terminal running hardhat node shows:
- Contract deployments
- Transaction details
- Event emissions
- Error messages
```

### Check Browser Console
```bash
# Open DevTools (F12)
# Look for:
- Network errors
- Contract call failures
- JavaScript errors
```

### Check MetaMask Activity
```bash
# MetaMask → Activity tab shows:
- Pending transactions
- Failed transactions
- Transaction history
```

### Verify Contract State
```bash
npx hardhat console --network localhost

# Then in console:
const LandRegistry = await ethers.getContractFactory("LandRegistry")
const contract = await LandRegistry.attach("YOUR_CONTRACT_ADDRESS")

# Check if land exists
await contract.getLandDetails("KE-001")

# Check owner
await contract.getOwner("KE-001")

# Check history
await contract.getHistory("KE-001")
```

## 📞 Still Having Issues?

1. **Check logs:**
   - Hardhat node terminal
   - Browser console (F12)
   - MetaMask activity

2. **Verify setup:**
   - Node.js version 18+
   - All dependencies installed
   - Hardhat node running
   - Contract deployed
   - MetaMask configured

3. **Start fresh:**
   ```bash
   # Kill everything
   pkill -f hardhat
   
   # Clean and restart
   npx hardhat clean
   rm -rf client/.next
   
   # Redeploy
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   node scripts/update-frontend-address.js
   
   # Restart frontend
   cd client && npm run dev
   ```

4. **Check documentation:**
   - [QUICKSTART.md](QUICKSTART.md)
   - [INTEGRATION.md](client/INTEGRATION.md)
   - [README.md](README.md)

## 💡 Prevention Tips

- Always keep Hardhat node running
- Don't close the terminal running Hardhat
- Reset MetaMask account after restarting Hardhat
- Use unique land IDs for testing
- Check network before every transaction
- Keep browser console open during development

---

**Most issues can be solved by restarting Hardhat node and resetting MetaMask account!**

#!/bin/bash

echo "🚀 Setting up ArdhiChain Local Development Environment"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing root dependencies..."
  npm install
fi

# Start Hardhat node in background
echo "🔧 Starting Hardhat local node..."
npx hardhat node > hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "   Hardhat node started (PID: $HARDHAT_PID)"
sleep 3

# Deploy contract
echo "📝 Deploying LandRegistry contract..."
npx hardhat run scripts/deploy.js --network localhost

# Update frontend with contract address
echo "🔄 Updating frontend with contract address..."
node scripts/update-frontend-address.js

# Install frontend dependencies
if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd client
  npm install
  cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Import a Hardhat test account into MetaMask"
echo "   2. Connect MetaMask to localhost:8545"
echo "   3. Start the frontend: cd client && npm run dev"
echo ""
echo "🔗 Hardhat node is running in the background"
echo "   View logs: tail -f hardhat-node.log"
echo "   Stop node: kill $HARDHAT_PID"
echo ""

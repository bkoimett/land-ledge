"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasWallet, setHasWallet] = useState(true);

  useEffect(() => {
    setHasWallet(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined');
  }, []);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="bg-green-100 px-3 py-2 rounded-lg">
          <p className="text-sm font-mono text-green-800">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (!hasWallet) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Install MetaMask</span>
        </a>
        <p className="text-xs text-gray-500">No wallet detected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <button
        onClick={() => connect({ connector: connectors[0] })}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
      {error && (
        <p className="text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}

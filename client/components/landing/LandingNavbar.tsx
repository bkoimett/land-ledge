"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { mockConnectWallet } from "@/lib/mockBlockchain";

export default function LandingNavbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const handleConnectWallet = async () => {
    if (walletAddress) {
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
      return;
    }

    setIsConnecting(true);
    try {
      const address = await mockConnectWallet();
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/80 backdrop-blur-md border-b border-[#bbcabf]/30">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#191c1e]">
          ArdhiChain
        </Link>
        
        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] hover:text-[#006c49] transition-colors">
            Features
          </a>
          <Link href="/verify" className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] hover:text-[#006c49] transition-colors">
            Verify
          </Link>
        </nav>
      </div>

      {/* Wallet Connect Button */}
      <div>
        {isConnecting ? (
          <button className="bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2 cursor-not-allowed">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </button>
        ) : walletAddress ? (
          <div className="flex items-center gap-2 bg-white border border-[#10b981] px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-[#10b981] rounded-full" />
            <span className="font-mono text-xs text-[#006c49]">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-[#006c49] text-white px-6 py-2 rounded-lg font-mono text-xs tracking-widest uppercase hover:bg-[#005236] active:scale-95 transition-all shadow-sm"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
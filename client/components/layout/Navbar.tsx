"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FilePlus, Send, Search, Landmark, History } from "lucide-react";
import { useState, useEffect } from "react";
import { mockConnectWallet } from "@/lib/mockBlockchain";

export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const handleConnectWallet = async () => {
    if (walletAddress) {
      // Disconnect
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

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/verify", label: "Verify Registry", icon: Search },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 h-20 bg-white/80 backdrop-blur-md border-b border-[#bbcabf]/30">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <span className="text-xl font-bold text-[#191c1e] flex items-center gap-1">
          ArdhiChain
          <span className="w-2 h-2 bg-[#006c49] rounded-full" />
        </span>
        
        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                  isActive
                    ? "text-[#10b981] border-b-2 border-[#10b981] pb-1"
                    : "text-[#3c4a42] hover:text-[#006c49]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
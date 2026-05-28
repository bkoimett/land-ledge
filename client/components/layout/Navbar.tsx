"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FilePlus, Send, Search, Landmark } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/register", label: "Register Land", icon: FilePlus },
    { href: "/transfer", label: "Transfer", icon: Send },
    { href: "/verify", label: "Verify", icon: Search },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Landmark className="h-8 w-8 text-green-600" />
            <Link href="/" className="font-bold text-xl text-gray-800">
              Ardhi<span className="text-green-600">Chain</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                    isActive
                      ? "bg-green-50 text-green-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect Button Placeholder */}
          <div>
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
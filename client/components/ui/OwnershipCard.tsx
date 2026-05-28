"use client";

import { Hash, User, MapPin, SquareStack, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

interface OwnershipCardProps {
  landId: string;
  currentOwner: string;
  ownerWallet: string;
  location: string;
  areaSize: string;
  dateRegistered: string;
}

// Helper to truncate wallet addresses
function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function OwnershipCard({
  landId,
  currentOwner,
  ownerWallet,
  location,
  areaSize,
  dateRegistered,
}: OwnershipCardProps) {
  return (
    <div className="card border-l-4 border-l-green-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Current Ownership Status</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Ownership Verified
        </span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Hash className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Land ID</p>
            <p className="font-mono font-semibold">{landId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <User className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Current Owner</p>
            <p className="font-semibold text-green-600">{currentOwner}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-5 w-5 flex items-center justify-center">
            <div className="h-3 w-3 bg-green-600 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Owner Wallet Address</p>
            <p className="font-mono text-sm">{truncateAddress(ownerWallet)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{location}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <SquareStack className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Area Size</p>
            <p className="font-medium">{areaSize}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Date Registered</p>
            <p className="font-medium">{dateRegistered}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href={`/history?landId=${landId}`}
          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition"
        >
          <span>View Full History</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
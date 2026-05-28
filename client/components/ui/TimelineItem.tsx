"use client";

import { ExternalLink } from "lucide-react";

interface TimelineItemProps {
  eventType: "Registered" | "Transferred";
  date: string;
  from: string;
  to: string;
  txHash: string;
  isLast?: boolean;
}

// Helper to truncate wallet addresses
function truncateAddress(address: string): string {
  if (address === "Genesis") return "Genesis";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to truncate transaction hash
function truncateTxHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-3)}`;
}

export default function TimelineItem({ 
  eventType, 
  date, 
  from, 
  to, 
  txHash, 
  isLast = false 
}: TimelineItemProps) {
  const isRegistered = eventType === "Registered";
  const dotColor = isRegistered ? "bg-green-600" : "bg-blue-500";
  const badgeClasses = isRegistered 
    ? "bg-green-100 text-green-700" 
    : "bg-blue-100 text-blue-700";

  return (
    <div className="relative flex">
      {/* Timeline dot */}
      <div className={`absolute left-4 top-1 w-4 h-4 rounded-full ${dotColor} border-4 border-white shadow`}></div>
      
      {/* Connecting line (not for last item) */}
      {!isLast && (
        <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-green-200"></div>
      )}
      
      {/* Content */}
      <div className="ml-12 flex-1 pb-8">
        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClasses}`}>
              {eventType}
            </span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">From:</span>{" "}
              <span className="font-mono font-medium">{truncateAddress(from)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">To:</span>{" "}
              <span className="font-mono font-medium">{truncateAddress(to)}</span>
            </p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition"
            >
              <span className="font-mono">{truncateTxHash(txHash)}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
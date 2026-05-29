"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface StatusBannerProps {
  status: "success" | "error";
  message: string;
  txHash?: string;
}

export default function StatusBanner({ status, message, txHash }: StatusBannerProps) {
  const isSuccess = status === "success";
  
  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-3 ${
      isSuccess 
        ? "bg-green-50 border-green-200" 
        : "bg-red-50 border-red-200"
    }`}>
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          isSuccess ? "text-green-800" : "text-red-800"
        }`}>
          {isSuccess ? "✅ " : "❌ "} {message}
        </p>
        {txHash && isSuccess && (
          <p className="text-xs mt-1 font-mono break-all">
            Transaction:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 underline"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </p>
        )}
        {txHash && !isSuccess && (
          <p className="text-xs mt-1 font-mono break-all">
            Transaction: <span className="text-red-600">{txHash}</span>
          </p>
        )}
      </div>
    </div>
  );
}
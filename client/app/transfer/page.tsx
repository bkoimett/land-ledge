"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function TransferPage() {
  const [formData, setFormData] = useState({
    landId: "",
    receiverAddress: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    setTimeout(() => {
      console.log("Transfer submitted:", formData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Send className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Ownership</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land ID *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g., LD-2024-001"
              value={formData.landId}
              onChange={(e) => setFormData({ ...formData, landId: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver's Wallet Address *
            </label>
            <input
              type="text"
              required
              className="input-field font-mono text-sm"
              placeholder="0x..."
              value={formData.receiverAddress}
              onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Ethereum wallet address of the new owner
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: This action is irreversible. Please verify the receiver's address carefully.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Transfer...</span>
              </span>
            ) : (
              "Transfer Ownership"
            )}
          </button>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✅ Ownership transferred successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
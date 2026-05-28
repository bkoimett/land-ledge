"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import StatusBanner from "@/components/ui/StatusBanner";

export default function TransferPage() {
  const [formData, setFormData] = useState({
    landId: "",
    currentOwner: "",
    receiverAddress: "",
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");

  // Validation functions
  const validateLandId = (id: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(id);
  };

  const validateWalletAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.landId.trim()) {
      newErrors.landId = "Land ID is required";
    } else if (!validateLandId(formData.landId)) {
      newErrors.landId = "Land ID must be alphanumeric (no spaces or special characters)";
    }

    if (!formData.receiverAddress.trim()) {
      newErrors.receiverAddress = "Receiver's wallet address is required";
    } else if (!validateWalletAddress(formData.receiverAddress)) {
      newErrors.receiverAddress = "Invalid Ethereum address format (must be 0x + 40 hex characters)";
    }

    if (!formData.confirm) {
      newErrors.confirm = "Please confirm the transfer by checking the checkbox";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus("loading");
    
    // Simulate transaction with random tx hash
    setTimeout(() => {
      const mockTxHash = "0x" + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      setTxHash(mockTxHash);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <Send className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Ownership</h1>
        <p className="text-gray-600">Transfer land ownership to a new wallet address on the blockchain</p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Land ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land ID *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., LD-2024-001"
              value={formData.landId}
              onChange={(e) => setFormData({ ...formData, landId: e.target.value })}
            />
            {errors.landId && (
              <p className="text-red-600 text-xs mt-1">{errors.landId}</p>
            )}
          </div>

          {/* Current Owner (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Owner
            </label>
            <input
              type="text"
              readOnly
              className="input-field bg-gray-50 cursor-not-allowed font-mono text-sm"
              placeholder="Auto-filled from connected wallet"
              value={formData.currentOwner}
              onChange={(e) => setFormData({ ...formData, currentOwner: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be auto-filled when wallet is connected
            </p>
          </div>

          {/* Receiver's Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver&apos;s Wallet Address *
            </label>
            <input
              type="text"
              className="input-field font-mono text-sm"
              placeholder="0x..."
              value={formData.receiverAddress}
              onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
            />
            {errors.receiverAddress && (
              <p className="text-red-600 text-xs mt-1">{errors.receiverAddress}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter the Ethereum wallet address of the new owner
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="confirm"
                checked={formData.confirm}
                onChange={(e) => setFormData({ ...formData, confirm: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer">
                I confirm I want to transfer ownership of this land
              </label>
              {errors.confirm && (
                <p className="text-red-600 text-xs mt-1">{errors.confirm}</p>
              )}
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: This action is irreversible. Please verify the receiver&apos;s address carefully.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Transaction...</span>
              </span>
            ) : (
              "Transfer Ownership"
            )}
          </button>

          {/* Status Banner */}
          {status === "success" && (
            <StatusBanner 
              status="success" 
              message="Ownership transferred successfully!" 
              txHash={txHash}
            />
          )}
          
          {status === "error" && (
            <StatusBanner 
              status="error" 
              message="Transaction failed. Please try again."
            />
          )}
        </form>
      </div>
    </div>
  );
}
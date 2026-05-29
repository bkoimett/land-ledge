"use client";

import { useState, useEffect } from "react";
import StatusBanner from "@/components/ui/StatusBanner";
import { mockTransferOwnership } from "@/lib/mockBlockchain";

interface TransferFormProps {
  onSuccess?: (txHash: string) => void;
}

export default function TransferForm({ onSuccess }: TransferFormProps) {
  const [formData, setFormData] = useState({
    landId: "",
    currentOwner: "",
    receiverAddress: "",
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");

  // Auto-fill current owner from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setFormData(prev => ({ ...prev, currentOwner: storedAddress }));
    }
  }, []);

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
    
    try {
      const hash = await mockTransferOwnership(formData.landId, formData.receiverAddress);
      setTxHash(hash);
      setStatus("success");
      if (onSuccess) onSuccess(hash);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("error");
    }
  };

  return (
    <section className="card-panel rounded-xl p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-[#eceef0] pb-4">
        <span className="text-[#a43a3a]">⇄</span>
        <h2 className="text-2xl font-semibold text-[#191c1e]">Transfer Land Title</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Target Asset ID */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Target Asset ID</label>
          <input 
            className="bg-white border border-[#e0e3e5] focus:border-[#a43a3a] focus:ring-1 focus:ring-[#a43a3a] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none font-mono" 
            placeholder="e.g. KE-001-NBI"
            value={formData.landId}
            onChange={(e) => setFormData({ ...formData, landId: e.target.value })}
          />
          {errors.landId && (
            <p className="text-red-500 text-xs mt-1 font-mono">{errors.landId}</p>
          )}
        </div>
        
        {/* Recipient Wallet */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Recipient Wallet Address</label>
          <input 
            className="bg-white border border-[#e0e3e5] focus:border-[#a43a3a] focus:ring-1 focus:ring-[#a43a3a] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none font-mono" 
            placeholder="0x..."
            value={formData.receiverAddress}
            onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
          />
          {errors.receiverAddress && (
            <p className="text-red-500 text-xs mt-1 font-mono">{errors.receiverAddress}</p>
          )}
        </div>
        
        {/* Warning */}
        <div className="p-4 bg-[#f2f4f6] rounded-lg border border-[#eceef0] flex gap-4">
          <span className="text-[#ba1a1a] mt-0.5">⚠</span>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs font-semibold text-[#191c1e]">Verification Required</p>
            <p className="font-mono text-xs text-[#3c4a42]">Transfer requires cryptographic authorization. This action is irreversible.</p>
          </div>
        </div>
        
        {/* Submit */}
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold font-mono text-xs tracking-widest uppercase py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Authorize On-Chain Transfer
        </button>
        
        {/* Status banner slot */}
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
    </section>
  );
}
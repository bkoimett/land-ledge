"use client";

import { useState, useEffect } from "react";
import StatusBanner from "@/components/ui/StatusBanner";
import { mockRegisterLand } from "@/lib/mockBlockchain";

interface RegisterFormProps {
  onSuccess?: (txHash: string) => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    landId: "",
    location: "",
    areaSize: "",
    areaUnit: "acres",
    ownerName: "",
    ownerWallet: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");

  // Auto-fill wallet address from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setFormData(prev => ({ ...prev, ownerWallet: storedAddress }));
    }
  }, []);

  // Validation functions
  const validateLandId = (id: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(id);
  };

  const validateAreaSize = (size: string): boolean => {
    const num = parseFloat(size);
    return !isNaN(num) && num > 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.landId.trim()) {
      newErrors.landId = "Land ID is required";
    } else if (!validateLandId(formData.landId)) {
      newErrors.landId = "Land ID must be alphanumeric (no spaces or special characters)";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.areaSize.trim()) {
      newErrors.areaSize = "Area size is required";
    } else if (!validateAreaSize(formData.areaSize)) {
      newErrors.areaSize = "Area size must be a positive number";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!formData.ownerWallet.trim()) {
      newErrors.ownerWallet = "Owner wallet address is required";
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
      const hash = await mockRegisterLand({
        landId: formData.landId,
        ownerName: formData.ownerName,
        ownerAddress: formData.ownerWallet,
        location: formData.location,
        areaSize: `${formData.areaSize} ${formData.areaUnit}`
      });
      
      setTxHash(hash);
      setStatus("success");
      if (onSuccess) onSuccess(hash);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Registration failed:", error);
      setStatus("error");
    }
  };

  return (
    <section className="card-panel rounded-xl p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-[#eceef0] pb-4">
        <span className="text-[#10b981]">⊞</span>
        <h2 className="text-2xl font-semibold text-[#191c1e]">Register New Asset</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Plot Number / Title Deed ID */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Plot Number / Title Deed ID</label>
          <input 
            className="bg-white border border-[#e0e3e5] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none" 
            placeholder="e.g. KE-001-NBI"
            value={formData.landId}
            onChange={(e) => setFormData({ ...formData, landId: e.target.value })}
          />
          {errors.landId && (
            <p className="text-red-500 text-xs mt-1 font-mono">{errors.landId}</p>
          )}
        </div>
        
        {/* Lat/Long row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Latitude</label>
            <input 
              className="bg-white border border-[#e0e3e5] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none" 
              placeholder="-1.286389"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Longitude</label>
            <input 
              className="bg-white border border-[#e0e3e5] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none" 
              placeholder="36.817223"
            />
          </div>
        </div>
        
        {/* Area Size */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Area Size (Sqm)</label>
          <input 
            type="number" 
            className="bg-white border border-[#e0e3e5] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none" 
            placeholder="5000"
            value={formData.areaSize}
            onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
          />
          {errors.areaSize && (
            <p className="text-red-500 text-xs mt-1 font-mono">{errors.areaSize}</p>
          )}
        </div>
        
        {/* Legal Owner Name */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest uppercase text-[#3c4a42]">Legal Owner Name</label>
          <input 
            className="bg-white border border-[#e0e3e5] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-[#191c1e] px-4 py-3 rounded-lg transition-colors placeholder:text-[#bbcabf] outline-none" 
            placeholder="Full Legal Identity"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-xs mt-1 font-mono">{errors.ownerName}</p>
          )}
        </div>
        
        {/* Submit */}
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="mt-4 bg-[#10b981] text-white font-semibold font-mono text-xs tracking-widest uppercase py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔒 Mint Immutable Record
        </button>
        
        {/* Status banner slot */}
        {status === "success" && (
          <StatusBanner 
            status="success" 
            message="Land registered successfully!" 
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
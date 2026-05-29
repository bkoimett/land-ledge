"use client";

import { useState, useEffect } from "react";
import { FilePlus } from "lucide-react";
import StatusBanner from "@/components/ui/StatusBanner";
import { mockRegisterLand } from "@/lib/mockBlockchain";

export default function RegisterPage() {
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
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Registration failed:", error);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FilePlus className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New Land</h1>
        <p className="text-gray-600">Register land ownership on the blockchain with immutable records</p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Land ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land ID / Title Deed Number *
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

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Nairobi, Karen District"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            {errors.location && (
              <p className="text-red-600 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Area Size with Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Size *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field"
                placeholder="e.g., 5.5"
                value={formData.areaSize}
                onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
              />
              {errors.areaSize && (
                <p className="text-red-600 text-xs mt-1">{errors.areaSize}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                className="input-field"
                value={formData.areaUnit}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Full Name *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., John Doe"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
            {errors.ownerName && (
              <p className="text-red-600 text-xs mt-1">{errors.ownerName}</p>
            )}
          </div>

          {/* Owner Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Wallet Address *
            </label>
            <input
              type="text"
              className="input-field font-mono text-sm"
              placeholder="0x... (auto-filled from connected wallet)"
              value={formData.ownerWallet}
              onChange={(e) => setFormData({ ...formData, ownerWallet: e.target.value })}
            />
            {errors.ownerWallet && (
              <p className="text-red-600 text-xs mt-1">{errors.ownerWallet}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This will be auto-filled when wallet is connected
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
              "Register Land on Blockchain"
            )}
          </button>

          {/* Status Banner */}
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
      </div>
    </div>
  );
}
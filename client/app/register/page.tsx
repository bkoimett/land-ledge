"use client";

import { useState } from "react";
import { FilePlus } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    landId: "",
    location: "",
    areaSize: "",
    areaUnit: "acres",
    ownerName: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate transaction
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <FilePlus className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Land</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land ID / Title Deed Number *
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
              Location *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g., Nairobi, Karen District"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Size *
              </label>
              <input
                type="number"
                required
                step="0.01"
                className="input-field"
                placeholder="e.g., 5.5"
                value={formData.areaSize}
                onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
              />
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
                <option value="sq-meters">Square Meters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Full Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g., John Doe"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>

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

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✅ Land registered successfully! Transaction confirmed on blockchain.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
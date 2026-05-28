"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OwnershipCard from "@/components/ui/OwnershipCard";
import EmptyState from "@/components/ui/EmptyState";

export default function VerifyPage() {
  const [landId, setLandId] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for KE-001
  const mockData: Record<string, any> = {
    "KE-001": {
      landId: "KE-001",
      currentOwner: "Mike Johnson",
      ownerWallet: "0xGhI39012",
      location: "Nairobi, Karen District",
      areaSize: "5.5 Acres",
      dateRegistered: "Jan 15, 2024",
    },
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!landId) {
      setError("Please enter a Land ID");
      setResult(null);
      return;
    }
    
    // Alphanumeric validation
    if (!/^[a-zA-Z0-9]+$/.test(landId)) {
      setError("Land ID must contain only letters and numbers");
      setResult(null);
      return;
    }
    
    setSearching(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      const data = mockData[landId];
      if (data) {
        setResult(data);
      } else {
        setResult(null);
        setError("Land ID not found. This plot may not be registered on ArdhiChain.");
      }
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Search className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Land Ownership</h1>
        <p className="text-gray-600">Search for any land plot to verify its ownership status on ArdhiChain</p>
      </div>

      {/* Search Bar Section */}
      <div className="card mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            required
            pattern="[a-zA-Z0-9]+"
            className="input-field flex-1"
            placeholder="Enter Land ID to verify ownership"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
          />
          <button
            type="submit"
            disabled={searching}
            className="btn-primary disabled:opacity-50 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{searching ? "Searching..." : "Search"}</span>
          </button>
        </form>
        
        {error && !result && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Loading State */}
      {searching && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Result Card */}
      {result && !searching && (
        <OwnershipCard
          landId={result.landId}
          currentOwner={result.currentOwner}
          ownerWallet={result.ownerWallet}
          location={result.location}
          areaSize={result.areaSize}
          dateRegistered={result.dateRegistered}
        />
      )}

      {/* Not Found State */}
      {!result && !searching && error && (
        <EmptyState
          type="not-found"
          title="Land ID Not Found"
          description={error}
          icon="file"
        />
      )}
    </div>
  );
}

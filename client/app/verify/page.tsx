"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OwnershipCard from "@/components/ui/OwnershipCard";
import EmptyState from "@/components/ui/EmptyState";
import { useGetLandDetails } from "@/hooks/useLandRegistry";
import { convertFromSqMeters, isValidLandId } from "@/lib/utils";

export default function VerifyPage() {
  const [landId, setLandId] = useState("");
  const [searchedLandId, setSearchedLandId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { data: landDetails, isLoading, isError, error: queryError } = useGetLandDetails(searchedLandId);

  // Debug logging
  if (searchedLandId) {
    console.log('Searching for:', searchedLandId);
    console.log('Loading:', isLoading);
    console.log('Error:', isError);
    if (isError && queryError) {
      console.log('Query Error:', queryError);
    }
    console.log('Data:', landDetails);
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!landId) {
      setError("Please enter a Land ID");
      setSearchedLandId(undefined);
      return;
    }
    
    if (!isValidLandId(landId)) {
      setError("Land ID must contain only letters and numbers");
      setSearchedLandId(undefined);
      return;
    }
    
    setError(null);
    setSearchedLandId(landId);
  };

  const formatAreaSize = (areaSqMeters: bigint) => {
    const acres = convertFromSqMeters(areaSqMeters, 'acres');
    const sqMeters = Number(areaSqMeters);
    return `${acres} Acres (${sqMeters.toLocaleString()} sq m)`;
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
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Searching..." : "Search"}</span>
          </button>
        </form>
        
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Result Card */}
      {landDetails && !isLoading && landDetails.exists && (
        <OwnershipCard
          landId={searchedLandId || ""}
          currentOwner="On-chain Owner"
          ownerWallet={landDetails.currentOwner}
          location={landDetails.location}
          areaSize={formatAreaSize(landDetails.areaSqMeters)}
          dateRegistered="On blockchain"
        />
      )}

      {/* Not Found State */}
      {searchedLandId && !isLoading && (isError || !landDetails?.exists) && (
        <EmptyState
          type="not-found"
          title="Land ID Not Found"
          description="This land ID is not registered on ArdhiChain."
          icon="file"
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { mockGetHistory, HistoryEvent } from "@/lib/mockBlockchain";

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

export default function HistoryPage() {
  const [landId, setLandId] = useState("");
  const [searching, setSearching] = useState(false);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [searched, setSearched] = useState(false);

  // Check for URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLandId = urlParams.get("landId");
    if (urlLandId) {
      setLandId(urlLandId);
      handleSearchWithId(urlLandId);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landId) return;
    handleSearchWithId(landId);
  };

  const handleSearchWithId = async (id: string) => {
    if (!id) return;
    
    setSearching(true);
    setSearched(true);
    
    try {
      const data = await mockGetHistory(id);
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    } finally {
      setSearching(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-16 max-w-[1440px] mx-auto mesh-gradient">

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute -inset-1 bg-[#006c49]/10 blur-xl rounded-full opacity-40" />
          <div className="relative flex items-center bg-white border border-[#bbcabf] focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/10 shadow-lg rounded-full px-6 py-4 transition-all duration-300">
            <span className="text-[#006c49] mr-4">🔍</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-base text-[#191c1e] placeholder:text-[#3c4a42]/40 outline-none font-mono" 
              placeholder="Enter Title Deed ID to view history"
              value={landId}
              onChange={(e) => setLandId(e.target.value)}
            />
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="bg-[#006c49] text-white px-8 py-2 rounded-full font-mono text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-md disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {searching && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      )}

      {/* Cryptographic Timeline */}
      {!searching && history.length > 0 && (
        <section className="max-w-4xl mx-auto relative">
          {/* Vertical dashed line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#bbcabf]/60 -translate-x-1/2" />

          <div className="space-y-24 relative">

            {/* CURRENT / LATEST EVENT */}
            {history.filter(e => e.eventType === "Registered").slice(-1).map((event, index) => (
              <div key={`current-${index}`} className="flex flex-col items-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-[#006c49] rounded-full glow-node radar-pulse" />
                </div>
                <div className="w-full md:w-[600px] mt-8 bg-white border border-[#006c49]/20 p-8 rounded-xl shadow-xl relative overflow-hidden">
                  {/* VERIFIED IMMUTABLE badge */}
                  <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center gap-2 text-[#00422b] font-mono text-xs tracking-widest border border-[#10b981]/30 px-3 py-1 rounded-full bg-[#10b981]/20">
                      <span className="w-2 h-2 bg-[#006c49] rounded-full animate-pulse" />
                      VERIFIED IMMUTABLE
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#191c1e] mb-6">Current Verified Status</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Land ID</p>
                      <p className="font-mono text-lg text-[#191c1e]">{landId}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Current Owner</p>
                      <p className="font-mono text-lg text-[#10b981]">{event.to}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Date Registered</p>
                      <p className="font-mono text-lg text-[#191c1e]">{formatDate(event.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* TRANSFER EVENTS — map over history array */}
            {history.filter(e => e.eventType === "Transferred").map((event, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-[#a43a3a] rounded-full glow-node-red" />
                </div>
                <div className="w-full md:w-[600px] mt-8 bg-white border border-[#bbcabf] shadow-lg p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold text-[#191c1e] mb-6">Title Transferred</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Date</p>
                      <p className="font-mono text-lg text-[#191c1e]">{formatDate(event.date)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">From</p>
                      <p className="font-mono text-lg text-[#191c1e]">{truncateAddress(event.from)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">To</p>
                      <p className="font-mono text-lg text-[#191c1e]">{truncateAddress(event.to)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Transaction</p>
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${event.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-lg text-[#006c49] hover:underline"
                      >
                        {truncateTxHash(event.txHash)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* GENESIS — first registration event */}
            {history.filter(e => e.eventType === "Registered").slice(0, 1).map((event, index) => (
              <div key={`genesis-${index}`} className="flex flex-col items-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-[#6c7a71] rounded-full" />
                </div>
                <div className="w-full md:w-[600px] mt-8 bg-[#f2f4f6] border border-[#bbcabf]/30 p-8 rounded-xl opacity-90 shadow-md">
                  <h3 className="text-2xl font-semibold text-[#191c1e] mb-6">Genesis Registration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Date</p>
                      <p className="font-mono text-lg text-[#191c1e]">{formatDate(event.date)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Initial Owner</p>
                      <p className="font-mono text-lg text-[#191c1e]">{truncateAddress(event.to)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs tracking-widest uppercase text-[#3c4a42] mb-1">Transaction</p>
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${event.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-lg text-[#006c49] hover:underline"
                      >
                        {truncateTxHash(event.txHash)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* Empty State - No search yet */}
      {!searching && !searched && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="font-mono text-sm text-[#3c4a42]">Enter a Land ID to view its ownership history</p>
        </div>
      )}

      {/* Not Found State */}
      {!searching && searched && history.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="font-mono text-sm text-[#ba1a1a]">No history found for Land ID: {landId}</p>
        </div>
      )}
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Search, Clock } from "lucide-react";
import TimelineItem from "@/components/ui/TimelineItem";
import EmptyState from "@/components/ui/EmptyState";
import { mockGetHistory, HistoryEvent } from "@/lib/mockBlockchain";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Clock className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Land History Timeline</h1>
      </div>

      {/* Search Bar */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            required
            pattern="[a-zA-Z0-9]+"
            className="input-field flex-1"
            placeholder="Enter Land ID to view history"
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
      </div>

      {/* Loading State */}
      {searching && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Timeline View */}
      {!searching && history.length > 0 && (
        <div className="card">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>
            
            {history.map((event, index) => (
              <TimelineItem
                key={`${event.txHash}-${index}`}
                eventType={event.eventType}
                date={event.date}
                from={event.from}
                to={event.to}
                txHash={event.txHash}
                isLast={index === history.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No search yet */}
      {!searching && !searched && (
        <EmptyState
          type="empty"
          title="No Land ID Searched"
          description="Enter a Land ID above to view its ownership history"
          icon="search"
        />
      )}

      {/* Not Found State */}
      {!searching && searched && history.length === 0 && (
        <EmptyState
          type="not-found"
          title="No History Found"
          description={`No history found for Land ID: ${landId}. This plot may not be registered on ArdhiChain.`}
          icon="file"
        />
      )}
    </div>
  );
}
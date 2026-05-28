"use client";

import { useState } from "react";
import { Search, Clock, User, Hash } from "lucide-react";

export default function VerifyPage() {
  const [landId, setLandId] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Mock history data
  const mockHistory = [
    { id: 1, action: "Registered", from: "0x123...", to: "John Doe", date: "2024-01-15", txHash: "0xabc123..." },
    { id: 2, action: "Transferred", from: "John Doe", to: "Jane Smith", date: "2024-03-20", txHash: "0xdef456..." },
    { id: 3, action: "Transferred", from: "Jane Smith", to: "Mike Johnson", date: "2024-06-10", txHash: "0xghi789..." },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landId) return;
    
    setSearching(true);
    setTimeout(() => {
      setResult({
        landId: landId,
        currentOwner: "Mike Johnson",
        location: "Nairobi, Karen District",
        areaSize: "5.5 Acres",
        registeredOn: "2024-01-15",
        history: mockHistory,
      });
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="card mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Search className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Land Ownership</h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            required
            className="input-field flex-1"
            placeholder="Enter Land ID to verify..."
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
          />
          <button
            type="submit"
            disabled={searching}
            className="btn-primary disabled:opacity-50"
          >
            {searching ? "Searching..." : "Verify"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Current Ownership Card */}
          <div className="card border-l-4 border-l-green-500">
            <h2 className="text-xl font-semibold mb-4">Current Ownership Status</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Land ID</p>
                  <p className="font-mono font-semibold">{result.landId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Owner</p>
                  <p className="font-semibold text-green-600">{result.currentOwner}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{result.location}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Area Size</p>
                <p className="font-medium">{result.areaSize}</p>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Ownership History Timeline</h2>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {result.history.map((event: any, index: number) => (
                <div key={event.id} className="relative flex mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow"></div>
                  
                  {/* Content */}
                  <div className="ml-12 flex-1">
                    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          event.action === "Registered" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {event.action}
                        </span>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm">
                        {event.action === "Registered" ? (
                          <>Registered by <span className="font-medium">{event.to}</span></>
                        ) : (
                          <>Transferred from <span className="font-medium">{event.from}</span> to <span className="font-medium">{event.to}</span></>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-2">
                        Tx: {event.txHash}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

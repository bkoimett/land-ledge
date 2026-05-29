// Mock Blockchain Service - Simulates real blockchain responses for demo purposes

export interface LandRecord {
  landId: string;
  ownerName: string;
  ownerAddress: string;
  location: string;
  areaSize: string;
  registeredAt: string;
  txHash: string;
}

export interface HistoryEvent {
  eventType: "Registered" | "Transferred";
  date: string;
  from: string;
  to: string;
  txHash: string;
}

// Simulated in-memory land registry (persists during the session)
const landRegistry: Record<string, LandRecord> = {
  "KE-001": {
    landId: "KE-001",
    ownerName: "James Omondi",
    ownerAddress: "0xAbC1234567890123456789012345678901234abcd",
    location: "Kisumu, Kondele Ward, Plot 45B",
    areaSize: "0.5 acres",
    registeredAt: "2024-01-15T10:30:00Z",
    txHash: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee5"
  }
};

// Simulated ownership history
const ownershipHistory: Record<string, HistoryEvent[]> = {
  "KE-001": [
    {
      eventType: "Registered",
      date: "Jan 15, 2024 10:30 AM",
      from: "Genesis",
      to: "0xAbC1...abcd",
      txHash: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee5"
    },
    {
      eventType: "Transferred",
      date: "Mar 22, 2024 02:15 PM",
      from: "0xAbC1...abcd",
      to: "0xDeF2...5678",
      txHash: "0xbbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee6"
    }
  ]
};

// Helper to generate fake transaction hashes
function generateTxHash(): string {
  const randomHex = Math.random().toString(16).substring(2, 66);
  return `0x${randomHex.padEnd(64, '0')}`;
}

// Helper to truncate address
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Simulated delay helper
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock functions with realistic delays

export async function mockConnectWallet(): Promise<string> {
  await delay(1500); // 1.5 second simulated connection time
  return "0xDem0...1234";
}

export async function mockRegisterLand(data: {
  landId: string;
  ownerName: string;
  ownerAddress: string;
  location: string;
  areaSize: string;
}): Promise<string> {
  await delay(2000); // 2 second simulated transaction time
  
  const txHash = generateTxHash();
  const now = new Date();
  
  const record: LandRecord = {
    landId: data.landId,
    ownerName: data.ownerName,
    ownerAddress: data.ownerAddress,
    location: data.location,
    areaSize: data.areaSize,
    registeredAt: now.toISOString(),
    txHash: txHash
  };
  
  landRegistry[data.landId] = record;
  
  // Add to ownership history
  const historyEvent: HistoryEvent = {
    eventType: "Registered",
    date: formatDate(now),
    from: "Genesis",
    to: truncateAddress(data.ownerAddress),
    txHash: txHash
  };
  
  if (!ownershipHistory[data.landId]) {
    ownershipHistory[data.landId] = [];
  }
  ownershipHistory[data.landId].unshift(historyEvent);
  
  return txHash;
}

export async function mockTransferOwnership(
  landId: string,
  newOwner: string
): Promise<string> {
  await delay(2000); // 2 second simulated transaction time
  
  const record = landRegistry[landId];
  if (!record) {
    throw new Error("Land record not found");
  }
  
  const oldOwner = record.ownerAddress;
  const txHash = generateTxHash();
  const now = new Date();
  
  // Update owner
  record.ownerAddress = newOwner;
  record.ownerName = "New Owner"; // In real app, this would come from form
  record.txHash = txHash;
  
  // Add to ownership history
  const historyEvent: HistoryEvent = {
    eventType: "Transferred",
    date: formatDate(now),
    from: truncateAddress(oldOwner),
    to: truncateAddress(newOwner),
    txHash: txHash
  };
  
  if (!ownershipHistory[landId]) {
    ownershipHistory[landId] = [];
  }
  ownershipHistory[landId].unshift(historyEvent);
  
  return txHash;
}

export async function mockGetOwner(landId: string): Promise<LandRecord | null> {
  await delay(1000); // 1 second simulated fetch time
  return landRegistry[landId] || null;
}

export async function mockGetHistory(landId: string): Promise<HistoryEvent[]> {
  await delay(1000); // 1 second simulated fetch time
  return ownershipHistory[landId] || [];
}

// Export for testing/debugging
export function getAllLandRecords(): Record<string, LandRecord> {
  return landRegistry;
}

export function clearRegistry(): void {
  Object.keys(landRegistry).forEach(key => delete landRegistry[key]);
  Object.keys(ownershipHistory).forEach(key => delete ownershipHistory[key]);
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Area conversion utilities
export const AREA_CONVERSIONS = {
  acres: 4046.86,
  hectares: 10000,
  sqft: 0.092903,
} as const;

export function convertToSqMeters(size: number, unit: keyof typeof AREA_CONVERSIONS): bigint {
  return BigInt(Math.floor(size * AREA_CONVERSIONS[unit]));
}

export function convertFromSqMeters(sqMeters: bigint, unit: keyof typeof AREA_CONVERSIONS): string {
  const meters = Number(sqMeters);
  const converted = meters / AREA_CONVERSIONS[unit];
  return converted.toFixed(2);
}

// Address formatting
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Date formatting
export function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Transaction hash formatting
export function formatTxHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

// Validation utilities
export function isValidLandId(landId: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(landId);
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

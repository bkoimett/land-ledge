import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LAND_REGISTRY_ADDRESS, LAND_REGISTRY_ABI } from '@/lib/contract';
import { Address } from 'viem';

export function useRegisterLand() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerLand = (landId: string, location: string, areaSqMeters: bigint) => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'registerLand',
      args: [landId, location, areaSqMeters],
    });
  };

  return {
    registerLand,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transferOwnership = (landId: string, newOwner: Address) => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'transferOwnership',
      args: [landId, newOwner],
    });
  };

  return {
    transferOwnership,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useGetLandDetails(landId: string | undefined) {
  return useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getLandDetails',
    args: landId ? [landId] : undefined,
    chainId: 31337, // Force Hardhat local network
    query: {
      enabled: !!landId,
    },
  });
}

export function useGetOwner(landId: string | undefined) {
  return useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getOwner',
    args: landId ? [landId] : undefined,
    chainId: 31337, // Force Hardhat local network
    query: {
      enabled: !!landId,
    },
  });
}

export function useGetHistory(landId: string | undefined) {
  return useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getHistory',
    args: landId ? [landId] : undefined,
    chainId: 31337, // Force Hardhat local network
    query: {
      enabled: !!landId,
    },
  });
}

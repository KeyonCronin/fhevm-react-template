/**
 * FHE-related TypeScript types
 */

export interface FHEContractConfig {
  address: string;
  abi: any[];
}

export interface EncryptedValue {
  handle: string;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
  userAddress: string;
}

export interface DecryptionResult {
  value: bigint | boolean | number | string;
  type: string;
}

export interface ComputationResult {
  success: boolean;
  data?: any;
  error?: string;
}

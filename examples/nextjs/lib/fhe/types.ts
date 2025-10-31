/**
 * FHE type definitions for the library
 */

export type FheType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';

export interface FheValue {
  handle: string;
  type: FheType;
}

export interface EncryptionResult {
  handles: string[];
  inputProof: string;
}

export interface DecryptionResult {
  value: bigint | boolean | number | string;
  type: FheType;
}

export interface FHEClientConfig {
  provider: any;
  network?: {
    chainId: number;
    name: string;
    rpcUrl: string;
  };
  gatewayUrl?: string;
  aclAddress?: string;
}

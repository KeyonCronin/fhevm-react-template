/**
 * API-related TypeScript types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptRequest {
  value: number | bigint | boolean | string;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';
  contractAddress: string;
  userAddress: string;
}

export interface DecryptRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
  signature?: string;
}

export interface ComputeRequest {
  operation: 'add' | 'sub' | 'mul' | 'div';
  operand1: string;
  operand2: string;
  contractAddress: string;
}

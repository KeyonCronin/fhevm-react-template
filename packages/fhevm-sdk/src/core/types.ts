/**
 * Core types for FHEVM SDK
 */

import type { Provider, Signer } from 'ethers';

/**
 * FHEVM client configuration
 */
export interface FhevmClientConfig {
  /** Ethereum provider */
  provider: Provider;
  /** Network configuration */
  network?: NetworkConfig;
  /** Gateway URL for decryption */
  gatewayUrl?: string;
  /** ACL contract address */
  aclAddress?: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  gatewayUrl?: string;
  aclAddress?: string;
}

/**
 * Encrypted input for contract calls
 */
export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  /** Contract address */
  contractAddress: string;
  /** Encrypted handle */
  handle: string;
  /** User address */
  userAddress: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult {
  /** Decrypted value */
  value: bigint | boolean | number;
  /** Original type */
  type: FheType;
}

/**
 * FHE data types
 */
export enum FheType {
  EUINT8 = 'euint8',
  EUINT16 = 'euint16',
  EUINT32 = 'euint32',
  EUINT64 = 'euint64',
  EUINT128 = 'euint128',
  EUINT256 = 'euint256',
  EBOOL = 'ebool',
  EADDRESS = 'eaddress',
}

/**
 * EIP-712 signature for decryption
 */
export interface EIP712Signature {
  signature: string;
  publicKey: string;
}

/**
 * FHEVM instance interface
 */
export interface FhevmInstance {
  createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInputBuilder;
  getPublicKey(contractAddress: string): Promise<string>;
  generatePublicKey(): Promise<string>;
}

/**
 * Encrypted input builder
 */
export interface EncryptedInputBuilder {
  add8(value: number): this;
  add16(value: number): this;
  add32(value: number): this;
  add64(value: bigint | number): this;
  add128(value: bigint): this;
  add256(value: bigint): this;
  addBool(value: boolean): this;
  addAddress(value: string): this;
  encrypt(): Promise<EncryptedInput>;
}

/**
 * Contract interaction helper
 */
export interface ContractHelper {
  address: string;
  abi: any[];
  signer: Signer;
}

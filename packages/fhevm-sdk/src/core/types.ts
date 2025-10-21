import type { Provider, Signer } from 'ethers';
import type { FhevmInstance } from 'fhevmjs';

export interface FhevmClientConfig {
  provider: Provider;
  network?: NetworkConfig;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl?: string;
}

export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
  userAddress?: string;
  signer?: Signer;
}

export interface DecryptionResult {
  value: bigint | boolean | number;
  type: FheType;
  signature?: string;
}

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

export interface FhevmClient {
  instance: FhevmInstance | null;
  provider: Provider;
  config: FhevmClientConfig;
  isInitialized: boolean;
  initialize(): Promise<void>;
  getPublicKey(contractAddress: string): Promise<string>;
}

export interface EncryptedInputBuilder {
  add8(value: number): EncryptedInputBuilder;
  add16(value: number): EncryptedInputBuilder;
  add32(value: number): EncryptedInputBuilder;
  add64(value: bigint | number): EncryptedInputBuilder;
  add128(value: bigint): EncryptedInputBuilder;
  add256(value: bigint): EncryptedInputBuilder;
  addBool(value: boolean): EncryptedInputBuilder;
  addAddress(value: string): EncryptedInputBuilder;
  encrypt(): Promise<EncryptedInput>;
}

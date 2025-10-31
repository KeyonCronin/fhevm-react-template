/**
 * Key management utilities for FHE operations
 */

export interface KeyPair {
  publicKey: string;
  privateKey?: string;
}

export interface KeyMetadata {
  algorithm: string;
  createdAt: number;
  contractAddress: string;
}

export class KeyManager {
  private keys: Map<string, KeyPair> = new Map();
  private metadata: Map<string, KeyMetadata> = new Map();

  /**
   * Store a public key for a contract
   */
  storePublicKey(contractAddress: string, publicKey: string, algorithm: string = 'TFHE') {
    this.keys.set(contractAddress, { publicKey });
    this.metadata.set(contractAddress, {
      algorithm,
      createdAt: Date.now(),
      contractAddress,
    });
  }

  /**
   * Retrieve public key for a contract
   */
  getPublicKey(contractAddress: string): string | null {
    const keyPair = this.keys.get(contractAddress);
    return keyPair?.publicKey || null;
  }

  /**
   * Get key metadata
   */
  getKeyMetadata(contractAddress: string): KeyMetadata | null {
    return this.metadata.get(contractAddress) || null;
  }

  /**
   * Check if public key exists for contract
   */
  hasPublicKey(contractAddress: string): boolean {
    return this.keys.has(contractAddress);
  }

  /**
   * Clear all stored keys
   */
  clearKeys() {
    this.keys.clear();
    this.metadata.clear();
  }

  /**
   * Remove key for specific contract
   */
  removeKey(contractAddress: string) {
    this.keys.delete(contractAddress);
    this.metadata.delete(contractAddress);
  }

  /**
   * Get all stored contract addresses
   */
  getContractAddresses(): string[] {
    return Array.from(this.keys.keys());
  }
}

// Singleton instance
export const keyManager = new KeyManager();

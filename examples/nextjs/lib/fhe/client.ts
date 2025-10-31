/**
 * Client-side FHE operations
 * Wrapper around @fhevm/sdk for client-side encryption and decryption
 */

import { createFhevmClient, createEncryptedInput, userDecrypt, publicDecrypt } from '@fhevm/sdk';
import type { Provider } from 'ethers';

export class FHEClientManager {
  private client: any = null;
  private provider: Provider | null = null;

  async initialize(provider: Provider) {
    this.provider = provider;
    this.client = await createFhevmClient({ provider });
    return this.client;
  }

  async encryptValue(
    value: number | bigint | boolean,
    type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool',
    contractAddress: string,
    userAddress: string
  ) {
    if (!this.client) {
      throw new Error('FHE client not initialized');
    }

    const input = await createEncryptedInput(this.client, contractAddress, userAddress);

    switch (type) {
      case 'euint8':
        input.add8(Number(value));
        break;
      case 'euint16':
        input.add16(Number(value));
        break;
      case 'euint32':
        input.add32(Number(value));
        break;
      case 'euint64':
        input.add64(BigInt(value));
        break;
      case 'ebool':
        input.addBool(Boolean(value));
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    return await input.encrypt();
  }

  async decryptValue(
    contractAddress: string,
    handle: string,
    signer: any
  ) {
    if (!this.client) {
      throw new Error('FHE client not initialized');
    }

    const result = await userDecrypt(this.client, {
      contractAddress,
      handle,
      userAddress: await signer.getAddress(),
      signer,
    });

    return result;
  }

  async publicDecryptValue(contractAddress: string, handle: string) {
    if (!this.client) {
      throw new Error('FHE client not initialized');
    }

    const result = await publicDecrypt(this.client, {
      contractAddress,
      handle,
    });

    return result;
  }

  getClient() {
    return this.client;
  }

  isInitialized() {
    return this.client !== null;
  }
}

// Singleton instance
let fheClientManager: FHEClientManager | null = null;

export function getFHEClientManager(): FHEClientManager {
  if (!fheClientManager) {
    fheClientManager = new FHEClientManager();
  }
  return fheClientManager;
}

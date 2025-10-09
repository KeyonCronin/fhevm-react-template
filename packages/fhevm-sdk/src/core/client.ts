/**
 * FHEVM Client - Core client for interacting with FHEVM
 */

import { createInstance, initFhevm } from 'fhevmjs';
import type { Provider } from 'ethers';
import type { FhevmClientConfig, FhevmInstance } from './types';

/**
 * Main FHEVM client class
 */
export class FhevmClient {
  private static instance: FhevmClient | null = null;
  private fhevmInstance: any = null;
  private provider: Provider;
  private config: FhevmClientConfig;
  private initialized: boolean = false;

  private constructor(config: FhevmClientConfig) {
    this.provider = config.provider;
    this.config = config;
  }

  /**
   * Get singleton instance
   */
  static getInstance(config: FhevmClientConfig): FhevmClient {
    if (!FhevmClient.instance) {
      FhevmClient.instance = new FhevmClient(config);
    }
    return FhevmClient.instance;
  }

  /**
   * Initialize FHEVM client
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize fhevmjs
      await initFhevm();

      // Get network details
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHEVM instance
      this.fhevmInstance = await createInstance({
        chainId,
        network: this.provider,
        gatewayUrl: this.config.gatewayUrl,
        aclAddress: this.config.aclAddress,
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize FHEVM client:', error);
      throw new Error(`FHEVM initialization failed: ${error}`);
    }
  }

  /**
   * Get FHEVM instance
   */
  getInstance(): any {
    if (!this.initialized || !this.fhevmInstance) {
      throw new Error('FHEVM client not initialized. Call initialize() first.');
    }
    return this.fhevmInstance;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get provider
   */
  getProvider(): Provider {
    return this.provider;
  }

  /**
   * Reset instance (for testing)
   */
  static resetInstance(): void {
    FhevmClient.instance = null;
  }
}

/**
 * Create and initialize FHEVM client
 * @param config Client configuration
 * @returns Initialized FHEVM client
 */
export async function createFhevmClient(config: FhevmClientConfig): Promise<FhevmClient> {
  const client = FhevmClient.getInstance(config);
  await client.initialize();
  return client;
}

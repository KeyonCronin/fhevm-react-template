import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';
import type { Provider } from 'ethers';
import type { FhevmClientConfig, FhevmClient as IFhevmClient } from './types';

export class FhevmClient implements IFhevmClient {
  private static instance: FhevmClient | null = null;
  
  public instance: FhevmInstance | null = null;
  public provider: Provider;
  public config: FhevmClientConfig;
  public isInitialized: boolean = false;

  private constructor(config: FhevmClientConfig) {
    this.config = config;
    this.provider = config.provider;
  }

  public static async create(config: FhevmClientConfig): Promise<FhevmClient> {
    if (!FhevmClient.instance) {
      FhevmClient.instance = new FhevmClient(config);
      await FhevmClient.instance.initialize();
    }
    return FhevmClient.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize FHEVM
      await initFhevm();

      // Get network information
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHEVM instance
      this.instance = await createInstance({
        chainId,
        network: this.provider,
        gatewayUrl: this.config.gatewayUrl,
        aclAddress: this.config.aclAddress,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize FHEVM client:', error);
      throw new Error('FHEVM initialization failed');
    }
  }

  public async getPublicKey(contractAddress: string): Promise<string> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }

    try {
      const publicKey = this.instance.getPublicKey(contractAddress);
      return publicKey;
    } catch (error) {
      console.error('Failed to get public key:', error);
      throw new Error('Failed to retrieve public key');
    }
  }

  public getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance;
  }
}

export async function createFhevmClient(config: FhevmClientConfig): Promise<FhevmClient> {
  return FhevmClient.create(config);
}

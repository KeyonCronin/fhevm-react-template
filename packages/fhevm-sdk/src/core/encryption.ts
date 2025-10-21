import type { FhevmClient } from './client';
import type { EncryptedInput, EncryptedInputBuilder as IEncryptedInputBuilder } from './types';

class EncryptedInputBuilder implements IEncryptedInputBuilder {
  private client: FhevmClient;
  private contractAddress: string;
  private userAddress: string;
  private values: Array<{ type: string; value: any }> = [];

  constructor(client: FhevmClient, contractAddress: string, userAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.userAddress = userAddress;
  }

  public add8(value: number): EncryptedInputBuilder {
    this.values.push({ type: 'uint8', value });
    return this;
  }

  public add16(value: number): EncryptedInputBuilder {
    this.values.push({ type: 'uint16', value });
    return this;
  }

  public add32(value: number): EncryptedInputBuilder {
    this.values.push({ type: 'uint32', value });
    return this;
  }

  public add64(value: bigint | number): EncryptedInputBuilder {
    this.values.push({ type: 'uint64', value: BigInt(value) });
    return this;
  }

  public add128(value: bigint): EncryptedInputBuilder {
    this.values.push({ type: 'uint128', value });
    return this;
  }

  public add256(value: bigint): EncryptedInputBuilder {
    this.values.push({ type: 'uint256', value });
    return this;
  }

  public addBool(value: boolean): EncryptedInputBuilder {
    this.values.push({ type: 'bool', value });
    return this;
  }

  public addAddress(value: string): EncryptedInputBuilder {
    this.values.push({ type: 'address', value });
    return this;
  }

  public async encrypt(): Promise<EncryptedInput> {
    const instance = this.client.getInstance();
    
    try {
      // Create encrypted input using fhevmjs
      const input = instance.createEncryptedInput(
        this.contractAddress,
        this.userAddress
      );

      // Add all values
      for (const { type, value } of this.values) {
        switch (type) {
          case 'uint8':
            input.add8(value);
            break;
          case 'uint16':
            input.add16(value);
            break;
          case 'uint32':
            input.add32(value);
            break;
          case 'uint64':
            input.add64(value);
            break;
          case 'uint128':
            input.add128(value);
            break;
          case 'uint256':
            input.add256(value);
            break;
          case 'bool':
            input.addBool(value);
            break;
          case 'address':
            input.addAddress(value);
            break;
        }
      }

      // Encrypt and get proof
      const encryptedData = input.encrypt();

      return {
        handles: encryptedData.handles,
        inputProof: encryptedData.inputProof,
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt input');
    }
  }
}

export async function createEncryptedInput(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string
): Promise<EncryptedInputBuilder> {
  return new EncryptedInputBuilder(client, contractAddress, userAddress);
}

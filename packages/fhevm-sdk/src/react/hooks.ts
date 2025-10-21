import { useState, useCallback } from 'react';
import type { Signer } from 'ethers';
import { useFhevmContext } from './context';
import { createEncryptedInput } from '../core/encryption';
import { userDecrypt, publicDecrypt } from '../core/decryption';
import type { FhevmClient } from '../core/client';
import type { EncryptedInput, DecryptionRequest, DecryptionResult } from '../core/types';

export function useFhevmClient(): FhevmClient | null {
  const { client } = useFhevmContext();
  return client;
}

interface UseEncryptReturn {
  encrypt: (
    contractAddress: string,
    userAddress: string,
    builder: (input: any) => void
  ) => Promise<EncryptedInput>;
  isEncrypting: boolean;
  error: Error | null;
}

export function useEncrypt(): UseEncryptReturn {
  const client = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (
      contractAddress: string,
      userAddress: string,
      builder: (input: any) => void
    ): Promise<EncryptedInput> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsEncrypting(true);
        setError(null);

        const input = await createEncryptedInput(client, contractAddress, userAddress);
        builder(input);
        const result = await input.encrypt();

        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return { encrypt, isEncrypting, error };
}

interface UseDecryptReturn {
  decrypt: (request: DecryptionRequest) => Promise<DecryptionResult>;
  isDecrypting: boolean;
  error: Error | null;
}

export function useDecrypt(): UseDecryptReturn {
  const client = useFhevmClient();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (request: DecryptionRequest): Promise<DecryptionResult> {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);

        const result = request.signer
          ? await userDecrypt(client, request)
          : await publicDecrypt(client, request);

        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return { decrypt, isDecrypting, error };
}

interface UseContractReturn<T> {
  contract: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useContract<T>(
  contractFactory: () => Promise<T>
): UseContractReturn<T> {
  const [contract, setContract] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const instance = await contractFactory();
      setContract(instance);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [contractFactory]);

  return { contract, isLoading, error };
}

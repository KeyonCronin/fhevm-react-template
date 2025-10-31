/**
 * Custom React hook for encryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { getFHEClientManager } from '../lib/fhe/client';

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(async (
    value: number | bigint | boolean,
    type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool',
    contractAddress: string,
    userAddress: string
  ) => {
    setIsEncrypting(true);
    setError(null);

    try {
      const manager = getFHEClientManager();

      if (!manager.isInitialized()) {
        throw new Error('FHE client not initialized. Please initialize first.');
      }

      const result = await manager.encryptValue(value, type, contractAddress, userAddress);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const encryptMultiple = useCallback(async (
    values: Array<{ value: number | bigint | boolean; type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' }>,
    contractAddress: string,
    userAddress: string
  ) => {
    setIsEncrypting(true);
    setError(null);

    try {
      const results = await Promise.all(
        values.map(({ value, type }) =>
          getFHEClientManager().encryptValue(value, type, contractAddress, userAddress)
        )
      );
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  return {
    encrypt,
    encryptMultiple,
    isEncrypting,
    error,
  };
}

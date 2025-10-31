/**
 * Custom React hook for FHE operations
 * Provides easy access to encryption, decryption, and FHE client
 */

'use client';

import { useState, useCallback } from 'react';
import { getFHEClientManager } from '../lib/fhe/client';
import type { Provider } from 'ethers';

export function useFHE(provider?: Provider) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async (providerInstance: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const manager = getFHEClientManager();
      await manager.initialize(providerInstance);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize FHE client');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getClient = useCallback(() => {
    return getFHEClientManager().getClient();
  }, []);

  const checkInitialized = useCallback(() => {
    return getFHEClientManager().isInitialized();
  }, []);

  return {
    isInitialized: isInitialized || checkInitialized(),
    isLoading,
    error,
    initialize,
    getClient,
  };
}

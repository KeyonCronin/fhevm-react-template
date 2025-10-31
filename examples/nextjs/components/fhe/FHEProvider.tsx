/**
 * FHE Context Provider
 * Provides FHE client instance to all child components
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFHEClientManager } from '../../lib/fhe/client';
import type { Provider } from 'ethers';

interface FHEContextValue {
  client: any;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: (provider: Provider) => Promise<void>;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

export function FHEProvider({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider?: Provider;
}) {
  const [client, setClient] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async (providerInstance: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const manager = getFHEClientManager();
      const fheClient = await manager.initialize(providerInstance);
      setClient(fheClient);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (provider && !isInitialized && !isLoading) {
      initialize(provider);
    }
  }, [provider, isInitialized, isLoading]);

  return (
    <FHEContext.Provider
      value={{
        client,
        isInitialized,
        isLoading,
        error,
        initialize,
      }}
    >
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}

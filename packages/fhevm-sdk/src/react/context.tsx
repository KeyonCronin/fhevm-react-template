import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Provider } from 'ethers';
import { FhevmClient, createFhevmClient } from '../core/client';
import type { FhevmClientConfig } from '../core/types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isLoading: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isLoading: true,
  error: null,
});

interface FhevmProviderProps {
  provider: Provider;
  config?: Partial<FhevmClientConfig>;
  children: ReactNode;
}

export function FhevmProvider({ provider, config, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeClient() {
      try {
        setIsLoading(true);
        setError(null);

        const fhevmClient = await createFhevmClient({
          provider,
          ...config,
        });

        if (mounted) {
          setClient(fhevmClient);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    initializeClient();

    return () => {
      mounted = false;
    };
  }, [provider, config]);

  return (
    <FhevmContext.Provider value={{ client, isLoading, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FhevmProvider } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

export default function Providers({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
    }
  }, []);

  if (!provider) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>MetaMask Required</h2>
        <p>Please install MetaMask to use this application.</p>
      </div>
    );
  }

  return (
    <FhevmProvider provider={provider}>
      {children}
    </FhevmProvider>
  );
}

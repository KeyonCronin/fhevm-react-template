'use client';

import { useState, useEffect } from 'react';
import Counter from '../components/Counter';
import WalletConnect from '../components/WalletConnect';
import { ethers } from 'ethers';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>FHEVM Next.js Example</h1>
      
      <WalletConnect 
        account={account} 
        isConnected={isConnected}
        onConnect={connectWallet}
      />

      {isConnected && account ? (
        <Counter contractAddress="0x..." userAddress={account} />
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Welcome to FHEVM SDK</h2>
          <p>Connect your wallet to start using encrypted counters.</p>
          <ul style={{ marginTop: '1rem' }}>
            <li>Encrypted state using FHE</li>
            <li>Privacy-preserving operations</li>
            <li>Decryption with user signatures</li>
          </ul>
        </div>
      )}
    </main>
  );
}

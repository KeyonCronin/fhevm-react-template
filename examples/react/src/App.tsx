import { useState, useEffect } from 'react';
import { FhevmProvider, useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import './App.css';

function CounterApp() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();
  
  const [account, setAccount] = useState<string>('');
  const [value, setValue] = useState<string>('1');
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    }
  };

  const handleEncrypt = async () => {
    if (!client || !account) return;
    
    try {
      const encrypted = await encrypt(
        '0x...', // contract address placeholder
        account,
        (input) => input.add32(parseInt(value))
      );
      
      alert('Value encrypted successfully! In production, this would submit to contract.');
      console.log('Encrypted data:', encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
      alert('Encryption failed. Check console for details.');
    }
  };

  const handleDecrypt = async () => {
    if (!client || !account) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const result = await decrypt({
        contractAddress: '0x...', // contract address placeholder
        handle: '0x...', // encrypted handle placeholder
        userAddress: account,
        signer,
      });

      setDecryptedValue(result.value.toString());
    } catch (error) {
      console.error('Decryption failed:', error);
      alert('Decryption failed. Check console for details.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 FHEVM React + Vite Example</h1>
        <p>Encrypted counter with SDK integration</p>
      </header>

      {!account ? (
        <div className="connect-section">
          <h2>Connect Your Wallet</h2>
          <p>Connect MetaMask to start using encrypted operations</p>
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="main-content">
          <div className="account-info">
            <strong>Connected:</strong>
            <span className="account-address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>

          <div className="card">
            <h2>Encrypt Value</h2>
            <div className="input-group">
              <label htmlFor="value">Enter a number:</label>
              <input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="1"
              />
            </div>
            <button 
              onClick={handleEncrypt} 
              disabled={isEncrypting || !client}
              className="action-button"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
            </button>
          </div>

          <div className="card">
            <h2>Decrypt Value</h2>
            <p className="description">
              Request decryption with your signature (EIP-712)
            </p>
            <button 
              onClick={handleDecrypt} 
              disabled={isDecrypting || !client}
              className="action-button"
            >
              {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
            </button>
            {decryptedValue && (
              <div className="result-box">
                <strong>Decrypted Value:</strong> {decryptedValue}
              </div>
            )}
          </div>

          <div className="info-card">
            <h3>How it works:</h3>
            <ul>
              <li>Values are encrypted using FHE before submission</li>
              <li>Encrypted data remains private on-chain</li>
              <li>Decryption requires user signature (EIP-712)</li>
              <li>Full privacy for sensitive computations</li>
            </ul>
          </div>

          <div className="note">
            <strong>Note:</strong> This is a demonstration. In production, you would connect to a deployed 
            contract and perform actual encrypted operations on-chain.
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  if (!provider) {
    return (
      <div className="app">
        <div className="error-message">
          <h2>MetaMask Required</h2>
          <p>Please install MetaMask browser extension to use this application.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="download-link"
          >
            Download MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <FhevmProvider provider={provider}>
      <CounterApp />
    </FhevmProvider>
  );
}

'use client';

import { useState } from 'react';
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

interface CounterProps {
  contractAddress: string;
  userAddress: string;
}

export default function Counter({ contractAddress, userAddress }: CounterProps) {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();
  const [value, setValue] = useState<number>(1);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);

  const handleIncrement = async () => {
    if (!client) return;

    try {
      const encrypted = await encrypt(contractAddress, userAddress, (input) => {
        input.add32(value);
      });

      console.log('Encrypted data:', encrypted);
      alert('Increment successful! (Note: Contract interaction would happen here)');
    } catch (error) {
      console.error('Encryption failed:', error);
      alert('Encryption failed. Check console for details.');
    }
  };

  const handleDecrypt = async () => {
    if (!client) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const result = await decrypt({
        contractAddress,
        handle: '0x...', // This would be the actual encrypted handle
        userAddress,
        signer,
      });

      setDecryptedValue(result.value.toString());
    } catch (error) {
      console.error('Decryption failed:', error);
      alert('Decryption failed. Check console for details.');
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Encrypted Counter</h2>
      
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Increment Counter</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
            min="1"
            style={{ maxWidth: '150px' }}
          />
          <button onClick={handleIncrement} disabled={isEncrypting || !client}>
            {isEncrypting ? 'Encrypting...' : 'Increment'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Decrypt Counter Value</h3>
        <button onClick={handleDecrypt} disabled={isDecrypting || !client} style={{ marginTop: '1rem' }}>
          {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
        </button>
        {decryptedValue && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '4px' }}>
            <strong>Decrypted Value:</strong> {decryptedValue}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '4px' }}>
        <strong>Note:</strong> This is a demonstration. In a real application, you would connect to a deployed contract
        and interact with it using the encrypted values.
      </div>
    </div>
  );
}

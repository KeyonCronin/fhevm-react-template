/**
 * Encryption Demo Component
 * Demonstrates how to encrypt values using the FHE SDK
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '../../hooks/useEncryption';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface EncryptionDemoProps {
  contractAddress: string;
  userAddress: string;
}

export default function EncryptionDemo({
  contractAddress,
  userAddress,
}: EncryptionDemoProps) {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool'>('euint32');
  const [result, setResult] = useState<any>(null);
  const { encrypt, isEncrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    try {
      let parsedValue: number | bigint | boolean;

      if (type === 'ebool') {
        parsedValue = value.toLowerCase() === 'true';
      } else if (type === 'euint64') {
        parsedValue = BigInt(value);
      } else {
        parsedValue = parseInt(value, 10);
      }

      const encrypted = await encrypt(parsedValue, type, contractAddress, userAddress);
      setResult(encrypted);
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <Card
      title="Encryption Demo"
      description="Encrypt values using FHE for privacy-preserving operations"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="euint8">euint8 (0-255)</option>
            <option value="euint16">euint16 (0-65535)</option>
            <option value="euint32">euint32 (0-4294967295)</option>
            <option value="euint64">euint64 (large numbers)</option>
            <option value="ebool">ebool (true/false)</option>
          </select>
        </div>

        <Input
          label="Value to Encrypt"
          type={type === 'ebool' ? 'text' : 'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === 'ebool' ? 'true or false' : 'Enter a number'}
          helperText={type === 'ebool' ? 'Enter "true" or "false"' : undefined}
        />

        <Button
          onClick={handleEncrypt}
          isLoading={isEncrypting}
          disabled={!value}
          variant="primary"
          className="w-full"
        >
          Encrypt Value
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Encrypted Result:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Handles:</span>
                <pre className="mt-1 p-2 bg-white rounded border overflow-x-auto">
                  {JSON.stringify(result.handles, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">Input Proof:</span>
                <pre className="mt-1 p-2 bg-white rounded border overflow-x-auto text-xs">
                  {result.inputProof.substring(0, 100)}...
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

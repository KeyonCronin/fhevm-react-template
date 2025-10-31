/**
 * Key Manager Component
 * Manages and displays FHE public keys for contracts
 */

'use client';

import React, { useState, useEffect } from 'react';
import { keyManager } from '../../lib/fhe/keys';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function KeyManager() {
  const [contracts, setContracts] = useState<string[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    refreshContracts();
  }, []);

  const refreshContracts = () => {
    const addresses = keyManager.getContractAddresses();
    setContracts(addresses);
  };

  const handleSelectContract = (address: string) => {
    setSelectedContract(address);
    const key = keyManager.getPublicKey(address);
    const meta = keyManager.getKeyMetadata(address);
    setPublicKey(key);
    setMetadata(meta);
  };

  const handleRemoveKey = (address: string) => {
    keyManager.removeKey(address);
    refreshContracts();
    if (selectedContract === address) {
      setSelectedContract('');
      setPublicKey(null);
      setMetadata(null);
    }
  };

  const handleClearAll = () => {
    keyManager.clearKeys();
    setContracts([]);
    setSelectedContract('');
    setPublicKey(null);
    setMetadata(null);
  };

  return (
    <Card
      title="Key Manager"
      description="Manage FHE public keys for contracts"
    >
      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No keys stored yet</p>
            <p className="text-sm mt-2">
              Keys will be added automatically when interacting with contracts
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stored Contracts ({contracts.length})
              </label>
              <div className="space-y-2">
                {contracts.map((address) => (
                  <div
                    key={address}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => handleSelectContract(address)}
                      className="flex-1 text-left font-mono text-sm text-blue-600 hover:text-blue-800"
                    >
                      {address.substring(0, 10)}...{address.substring(address.length - 8)}
                    </button>
                    <Button
                      onClick={() => handleRemoveKey(address)}
                      variant="danger"
                      className="ml-2 text-xs px-2 py-1"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {selectedContract && publicKey && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Public Key Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Contract:</span>
                    <p className="font-mono text-xs break-all mt-1">{selectedContract}</p>
                  </div>
                  {metadata && (
                    <>
                      <div>
                        <span className="font-medium">Algorithm:</span>
                        <span className="ml-2">{metadata.algorithm}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <span className="ml-2">
                          {new Date(metadata.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="font-medium">Public Key:</span>
                    <pre className="mt-1 p-2 bg-white rounded border overflow-x-auto text-xs">
                      {publicKey.substring(0, 100)}...
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleClearAll}
              variant="danger"
              className="w-full"
            >
              Clear All Keys
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

/**
 * Banking Example Component
 * Demonstrates confidential banking operations using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '../../hooks/useEncryption';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface BankingExampleProps {
  contractAddress: string;
  userAddress: string;
}

export default function BankingExample({
  contractAddress,
  userAddress,
}: BankingExampleProps) {
  const [balance, setBalance] = useState<number>(1000);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [transactionHistory, setTransactionHistory] = useState<Array<{
    type: string;
    amount: string;
    timestamp: Date;
    encrypted: boolean;
  }>>([]);

  const { encrypt, isEncrypting } = useEncryption();

  const handleTransaction = async () => {
    try {
      const amountValue = parseInt(amount, 10);

      // Encrypt the transaction amount
      const encrypted = await encrypt(amountValue, 'euint32', contractAddress, userAddress);

      // Update balance (in real app, this would be on-chain)
      if (operation === 'deposit') {
        setBalance(balance + amountValue);
      } else if (operation === 'withdraw' && balance >= amountValue) {
        setBalance(balance - amountValue);
      }

      // Add to transaction history
      setTransactionHistory([
        {
          type: operation,
          amount: amount,
          timestamp: new Date(),
          encrypted: true,
        },
        ...transactionHistory,
      ]);

      setAmount('');
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  return (
    <Card
      title="Confidential Banking Example"
      description="Privacy-preserving banking transactions using FHE"
    >
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Current Balance</p>
          <p className="text-3xl font-bold mt-1">${balance.toLocaleString()}</p>
        </div>

        {/* Transaction Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>

          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            helperText="Transaction amount will be encrypted"
          />

          <Button
            onClick={handleTransaction}
            isLoading={isEncrypting}
            disabled={!amount || (operation === 'withdraw' && parseInt(amount) > balance)}
            variant={operation === 'deposit' ? 'success' : 'primary'}
            className="w-full"
          >
            {operation === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </Button>
        </div>

        {/* Transaction History */}
        {transactionHistory.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Transaction History</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactionHistory.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-sm capitalize">
                      {tx.type}
                      {tx.encrypted && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Encrypted
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tx.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Privacy Features</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Transaction amounts are encrypted before submission</li>
            <li>Balance calculations happen on encrypted data</li>
            <li>Only authorized parties can decrypt transaction details</li>
            <li>Full privacy with FHE technology</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

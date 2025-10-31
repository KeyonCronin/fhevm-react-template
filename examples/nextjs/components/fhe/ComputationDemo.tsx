/**
 * Computation Demo Component
 * Demonstrates FHE computations on encrypted data
 */

'use client';

import React, { useState } from 'react';
import { useComputation } from '../../hooks/useComputation';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface ComputationDemoProps {
  contractAddress: string;
}

export default function ComputationDemo({
  contractAddress,
}: ComputationDemoProps) {
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'div'>('add');
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [result, setResult] = useState<any>(null);
  const { compute, isComputing, error } = useComputation();

  const handleCompute = async () => {
    try {
      const computeResult = await compute(operation, operand1, operand2, contractAddress);
      setResult(computeResult);
    } catch (err) {
      console.error('Computation error:', err);
    }
  };

  return (
    <Card
      title="Computation Demo"
      description="Perform homomorphic operations on encrypted values"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (×)</option>
            <option value="div">Division (÷)</option>
          </select>
        </div>

        <Input
          label="Encrypted Handle 1"
          type="text"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
          placeholder="0x..."
          helperText="First encrypted value handle"
        />

        <Input
          label="Encrypted Handle 2"
          type="text"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
          placeholder="0x..."
          helperText="Second encrypted value handle"
        />

        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!operand1 || !operand2}
          variant="primary"
          className="w-full"
        >
          Compute Result
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && result.success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Computation Result:</h4>
            <pre className="p-2 bg-white rounded border overflow-x-auto text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Custom React hook for FHE computation operations
 */

'use client';

import { useState, useCallback } from 'react';

interface ComputationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async (
    operation: 'add' | 'sub' | 'mul' | 'div',
    operand1: string,
    operand2: string,
    contractAddress: string
  ): Promise<ComputationResult> => {
    setIsComputing(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          operand1,
          operand2,
          contractAddress,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Computation failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsComputing(false);
    }
  }, []);

  return {
    compute,
    isComputing,
    error,
  };
}

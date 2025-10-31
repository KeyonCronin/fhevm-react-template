/**
 * Validation utilities for user inputs and FHE operations
 */

import { isValidAddress, isValidHandle, validateNumericInput } from './security';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate encryption request
 */
export function validateEncryptionRequest(
  value: any,
  type: string,
  contractAddress: string,
  userAddress: string
): ValidationResult {
  // Validate addresses
  if (!isValidAddress(contractAddress)) {
    return { isValid: false, error: 'Invalid contract address' };
  }

  if (!isValidAddress(userAddress)) {
    return { isValid: false, error: 'Invalid user address' };
  }

  // Validate type
  const validTypes = ['euint8', 'euint16', 'euint32', 'euint64', 'ebool', 'eaddress'];
  if (!validTypes.includes(type)) {
    return { isValid: false, error: `Invalid type: ${type}` };
  }

  // Validate value based on type
  if (type === 'ebool') {
    if (typeof value !== 'boolean') {
      return { isValid: false, error: 'Value must be boolean for ebool type' };
    }
  } else if (type === 'eaddress') {
    if (!isValidAddress(value)) {
      return { isValid: false, error: 'Invalid address value' };
    }
  } else {
    // Numeric types
    try {
      const numValue = typeof value === 'bigint' ? value : BigInt(value);
      if (!validateNumericInput(numValue, type as any)) {
        return { isValid: false, error: `Value out of range for ${type}` };
      }
    } catch (e) {
      return { isValid: false, error: 'Invalid numeric value' };
    }
  }

  return { isValid: true };
}

/**
 * Validate decryption request
 */
export function validateDecryptionRequest(
  handle: string,
  contractAddress: string,
  userAddress: string
): ValidationResult {
  if (!isValidHandle(handle)) {
    return { isValid: false, error: 'Invalid handle format' };
  }

  if (!isValidAddress(contractAddress)) {
    return { isValid: false, error: 'Invalid contract address' };
  }

  if (!isValidAddress(userAddress)) {
    return { isValid: false, error: 'Invalid user address' };
  }

  return { isValid: true };
}

/**
 * Validate computation request
 */
export function validateComputationRequest(
  operation: string,
  operand1: string,
  operand2: string,
  contractAddress: string
): ValidationResult {
  const validOperations = ['add', 'sub', 'mul', 'div'];
  if (!validOperations.includes(operation)) {
    return { isValid: false, error: `Invalid operation: ${operation}` };
  }

  if (!isValidHandle(operand1)) {
    return { isValid: false, error: 'Invalid operand1 handle' };
  }

  if (!isValidHandle(operand2)) {
    return { isValid: false, error: 'Invalid operand2 handle' };
  }

  if (!isValidAddress(contractAddress)) {
    return { isValid: false, error: 'Invalid contract address' };
  }

  return { isValid: true };
}

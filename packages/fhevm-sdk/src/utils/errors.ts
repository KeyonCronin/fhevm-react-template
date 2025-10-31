/**
 * Custom error classes for FHEVM SDK
 */

export class FhevmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

export class InitializationError extends FhevmError {
  constructor(message: string = 'FHEVM client not initialized') {
    super(message);
    this.name = 'InitializationError';
  }
}

export class EncryptionError extends FhevmError {
  constructor(message: string = 'Encryption failed') {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends FhevmError {
  constructor(message: string = 'Decryption failed') {
    super(message);
    this.name = 'DecryptionError';
  }
}

export class ValidationError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ContractError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

/**
 * Handle and format errors consistently
 */
export function handleError(error: unknown): FhevmError {
  if (error instanceof FhevmError) {
    return error;
  }

  if (error instanceof Error) {
    return new FhevmError(error.message);
  }

  return new FhevmError('An unknown error occurred');
}

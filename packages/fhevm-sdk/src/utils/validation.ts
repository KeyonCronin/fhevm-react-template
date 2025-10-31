/**
 * Validation utilities for FHEVM operations
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate handle format
 */
export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(handle);
}

/**
 * Validate numeric input within FHE type range
 */
export function validateNumericRange(
  value: bigint,
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64'
): boolean {
  switch (type) {
    case 'euint8':
      return value >= 0n && value <= 255n;
    case 'euint16':
      return value >= 0n && value <= 65535n;
    case 'euint32':
      return value >= 0n && value <= 4294967295n;
    case 'euint64':
      return value >= 0n && value <= 18446744073709551615n;
    default:
      return false;
  }
}

/**
 * Validate contract address and throw if invalid
 */
export function assertValidAddress(address: string, paramName: string = 'address'): void {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid ${paramName}: ${address}`);
  }
}

/**
 * Validate handle and throw if invalid
 */
export function assertValidHandle(handle: string): void {
  if (!isValidHandle(handle)) {
    throw new Error(`Invalid handle: ${handle}`);
  }
}

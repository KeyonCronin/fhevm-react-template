/**
 * Security utilities for FHE operations
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
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>'"]/g, '');
}

/**
 * Validate numeric input within range
 */
export function validateNumericInput(
  value: number | bigint,
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64'
): boolean {
  const numValue = typeof value === 'bigint' ? value : BigInt(value);

  switch (type) {
    case 'euint8':
      return numValue >= 0n && numValue <= 255n;
    case 'euint16':
      return numValue >= 0n && numValue <= 65535n;
    case 'euint32':
      return numValue >= 0n && numValue <= 4294967295n;
    case 'euint64':
      return numValue >= 0n && numValue <= 18446744073709551615n;
    default:
      return false;
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];

    // Filter out old timestamps
    const recentTimestamps = timestamps.filter(t => now - t < this.timeWindow);

    if (recentTimestamps.length >= this.maxRequests) {
      return false;
    }

    recentTimestamps.push(now);
    this.requests.set(identifier, recentTimestamps);
    return true;
  }

  reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

/**
 * Formatting utilities for FHEVM SDK
 */

/**
 * Format address for display (truncated)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format handle for display
 */
export function formatHandle(handle: string, chars: number = 8): string {
  if (!handle || handle.length < 16) return handle;
  return `${handle.slice(0, chars + 2)}...${handle.slice(-chars)}`;
}

/**
 * Convert bigint to hex string
 */
export function bigintToHex(value: bigint): string {
  return `0x${value.toString(16)}`;
}

/**
 * Convert hex string to bigint
 */
export function hexToBigint(hex: string): bigint {
  return BigInt(hex);
}

/**
 * Format FHE type name
 */
export function formatFheType(type: string): string {
  const typeMap: Record<string, string> = {
    euint8: 'Encrypted 8-bit Integer',
    euint16: 'Encrypted 16-bit Integer',
    euint32: 'Encrypted 32-bit Integer',
    euint64: 'Encrypted 64-bit Integer',
    ebool: 'Encrypted Boolean',
    eaddress: 'Encrypted Address',
  };
  return typeMap[type] || type;
}

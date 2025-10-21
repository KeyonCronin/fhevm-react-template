// Core exports
export * from './core/types';
export * from './core/client';
export * from './core/encryption';
export * from './core/decryption';

// Re-export main functions
export { createFhevmClient, FhevmClient } from './core/client';
export { createEncryptedInput } from './core/encryption';
export { userDecrypt, publicDecrypt } from './core/decryption';

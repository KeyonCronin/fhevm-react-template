/**
 * @fhevm/sdk - Universal SDK for building confidential dApps with FHEVM
 * Framework-agnostic core library for encryption, decryption, and FHEVM operations
 */

export * from './core/client';
export * from './core/encryption';
export * from './core/decryption';
export * from './core/types';
export * from './core/utils';

// React-specific exports
export * from './react/hooks';
export * from './react/provider';
export * from './react/types';

// Vue-specific exports (optional)
// export * from './vue/composables';

// Constants and configs
export * from './constants';

/**
 * Vue adapter for FHEVM SDK
 * Provides Vue 3 composables for FHE operations
 */

import { ref, computed, Ref } from 'vue';
import { createFhevmClient, FhevmClient } from '../core/client';
import { createEncryptedInput } from '../core/encryption';
import { userDecrypt, publicDecrypt } from '../core/decryption';
import type { FhevmClientConfig, DecryptRequest } from '../core/types';

/**
 * Main Vue composable for FHEVM client
 */
export function useFhevm(config?: Ref<FhevmClientConfig> | FhevmClientConfig) {
  const client: Ref<FhevmClient | null> = ref(null);
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const error: Ref<string | null> = ref(null);

  const initialize = async (initConfig?: FhevmClientConfig) => {
    isLoading.value = true;
    error.value = null;

    try {
      const configToUse = initConfig || (typeof config === 'object' && 'value' in config ? config.value : config);
      if (!configToUse) {
        throw new Error('Configuration is required');
      }

      client.value = await createFhevmClient(configToUse);
      isInitialized.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Initialization failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    client: computed(() => client.value),
    isInitialized: computed(() => isInitialized.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    initialize,
  };
}

/**
 * Vue composable for encryption operations
 */
export function useFhevmEncrypt(client: Ref<FhevmClient | null>) {
  const isEncrypting = ref(false);
  const error: Ref<string | null> = ref(null);

  const encrypt = async (
    contractAddress: string,
    userAddress: string,
    builder: (input: any) => void
  ) => {
    if (!client.value) {
      throw new Error('FHEVM client not initialized');
    }

    isEncrypting.value = true;
    error.value = null;

    try {
      const input = await createEncryptedInput(client.value, contractAddress, userAddress);
      builder(input);
      return await input.encrypt();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Encryption failed';
      throw err;
    } finally {
      isEncrypting.value = false;
    }
  };

  return {
    encrypt,
    isEncrypting: computed(() => isEncrypting.value),
    error: computed(() => error.value),
  };
}

/**
 * Vue composable for decryption operations
 */
export function useFhevmDecrypt(client: Ref<FhevmClient | null>) {
  const isDecrypting = ref(false);
  const error: Ref<string | null> = ref(null);

  const decrypt = async (request: DecryptRequest) => {
    if (!client.value) {
      throw new Error('FHEVM client not initialized');
    }

    isDecrypting.value = true;
    error.value = null;

    try {
      return await userDecrypt(client.value, request);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Decryption failed';
      throw err;
    } finally {
      isDecrypting.value = false;
    }
  };

  const decryptPublic = async (contractAddress: string, handle: string) => {
    if (!client.value) {
      throw new Error('FHEVM client not initialized');
    }

    isDecrypting.value = true;
    error.value = null;

    try {
      return await publicDecrypt(client.value, { contractAddress, handle });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Public decryption failed';
      throw err;
    } finally {
      isDecrypting.value = false;
    }
  };

  return {
    decrypt,
    decryptPublic,
    isDecrypting: computed(() => isDecrypting.value),
    error: computed(() => error.value),
  };
}

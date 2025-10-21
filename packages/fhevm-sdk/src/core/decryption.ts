import type { Signer } from 'ethers';
import type { FhevmClient } from './client';
import type { DecryptionRequest, DecryptionResult, FheType } from './types';

export async function userDecrypt(
  client: FhevmClient,
  request: DecryptionRequest
): Promise<DecryptionResult> {
  if (!request.signer) {
    throw new Error('Signer required for user decryption');
  }

  const instance = client.getInstance();

  try {
    // Create EIP-712 signature for decryption
    const { publicKey, signature } = await instance.generateToken({
      verifyingContract: request.contractAddress,
    });

    // Request decryption from the oracle
    const decryptedValue = await instance.reencrypt(
      request.handle,
      publicKey,
      signature,
      request.contractAddress,
      request.userAddress || (await request.signer.getAddress())
    );

    // Determine the type based on the handle
    const type = inferFheType(request.handle);

    return {
      value: decryptedValue,
      type,
      signature,
    };
  } catch (error) {
    console.error('User decryption failed:', error);
    throw new Error('Failed to decrypt value');
  }
}

export async function publicDecrypt(
  client: FhevmClient,
  request: DecryptionRequest
): Promise<DecryptionResult> {
  const instance = client.getInstance();

  try {
    // Request public decryption from oracle
    const decryptedValue = await instance.decrypt(
      request.contractAddress,
      request.handle
    );

    const type = inferFheType(request.handle);

    return {
      value: decryptedValue,
      type,
    };
  } catch (error) {
    console.error('Public decryption failed:', error);
    throw new Error('Failed to decrypt value');
  }
}

function inferFheType(handle: string): FheType {
  // This is a simplified type inference
  // In production, you would need proper type metadata
  const handleLength = handle.length;
  
  if (handleLength <= 4) return FheType.EUINT8;
  if (handleLength <= 6) return FheType.EUINT16;
  if (handleLength <= 10) return FheType.EUINT32;
  if (handleLength <= 18) return FheType.EUINT64;
  if (handleLength <= 34) return FheType.EUINT128;
  return FheType.EUINT256;
}

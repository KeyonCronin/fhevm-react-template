# @fhevm/sdk

Universal SDK for building confidential dApps with Zama's FHEVM.

## Features

- Framework-agnostic core library
- React hooks and provider
- Full TypeScript support
- Complete FHE encryption/decryption flow
- Wagmi-like API structure

## Installation

```bash
npm install @fhevm/sdk ethers fhevmjs
```

## Quick Start

### Core Usage (Framework-agnostic)

```typescript
import { createFhevmClient, createEncryptedInput, userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Initialize client
const provider = new ethers.BrowserProvider(window.ethereum);
const client = await createFhevmClient({ provider });

// Encrypt input
const input = await createEncryptedInput(client, contractAddress, userAddress);
input.add64(1000);
const { handles, inputProof } = await input.encrypt();

// Use in contract call
await contract.myFunction(handles[0], inputProof);

// Decrypt result
const result = await userDecrypt(client, {
  contractAddress,
  handle,
  signer,
});
console.log('Decrypted value:', result.value);
```

### React Usage

```tsx
import { FhevmProvider, useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      <YourApp />
    </FhevmProvider>
  );
}

function Counter() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const incrementEncrypted = async () => {
    const encrypted = await encrypt(
      contractAddress,
      userAddress,
      (input) => input.add32(1)
    );

    await contract.increment(encrypted.handles[0], encrypted.inputProof);
  };

  const getDecryptedValue = async () => {
    const result = await decrypt({
      contractAddress,
      handle: encryptedCounter,
      signer,
    });

    console.log('Counter value:', result.value);
  };

  return (
    <div>
      <button onClick={incrementEncrypted} disabled={isEncrypting}>
        Increment
      </button>
      <button onClick={getDecryptedValue} disabled={isDecrypting}>
        Get Value
      </button>
    </div>
  );
}
```

## API Reference

### Core Functions

#### `createFhevmClient(config: FhevmClientConfig): Promise<FhevmClient>`

Initialize FHEVM client.

**Parameters:**
- `provider` - Ethers provider
- `network` - Optional network configuration
- `gatewayUrl` - Optional gateway URL
- `aclAddress` - Optional ACL contract address

#### `createEncryptedInput(client, contractAddress, userAddress): Promise<EncryptedInputBuilder>`

Create encrypted input builder.

**Methods:**
- `add8(value: number)` - Add euint8
- `add16(value: number)` - Add euint16
- `add32(value: number)` - Add euint32
- `add64(value: bigint)` - Add euint64
- `add128(value: bigint)` - Add euint128
- `add256(value: bigint)` - Add euint256
- `addBool(value: boolean)` - Add ebool
- `addAddress(value: string)` - Add eaddress
- `encrypt()` - Encrypt and get proof

#### `userDecrypt(client, request): Promise<DecryptionResult>`

Decrypt with user signature (EIP-712).

#### `publicDecrypt(client, request): Promise<DecryptionResult>`

Oracle-based public decryption.

### React Hooks

#### `useFhevmClient(): FhevmClient | null`

Get FHEVM client instance.

#### `useEncrypt(): { encrypt, isEncrypting, error }`

Encrypt values hook.

#### `useDecrypt(): { decrypt, isDecrypting, error }`

Decrypt values hook.

#### `useContract<T>(factory): { contract, isLoading, error }`

Contract helper hook.

## Types

```typescript
interface FhevmClientConfig {
  provider: Provider;
  network?: NetworkConfig;
  gatewayUrl?: string;
  aclAddress?: string;
}

interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

interface DecryptionResult {
  value: bigint | boolean | number;
  type: FheType;
  signature?: string;
}

enum FheType {
  EUINT8 = 'euint8',
  EUINT16 = 'euint16',
  EUINT32 = 'euint32',
  EUINT64 = 'euint64',
  EUINT128 = 'euint128',
  EUINT256 = 'euint256',
  EBOOL = 'ebool',
  EADDRESS = 'eaddress',
}
```

## Examples

See the `examples/` directory for complete examples:

- Next.js example with App Router
- React example with Vite
- Auction dApp with encrypted bidding

## License

MIT

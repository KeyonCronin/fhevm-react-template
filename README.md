# 🔐 FHEVM React Template - Universal SDK

> Framework-agnostic SDK for building confidential dApps with Zama's FHEVM

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-purple)](https://docs.zama.ai/fhevm)
[![Built for Bounty](https://img.shields.io/badge/Built%20for-Zama%20Bounty-success)](https://github.com/zama-ai/bounty)

**🎥 Video Demo**: [View demo.mp4](./demo.mp4)

**Built for the Zama FHEVM SDK Bounty** - A universal, framework-agnostic SDK that makes building confidential frontends simple, consistent, and developer-friendly.

---

## 🎯 Overview

This repository provides a **universal FHEVM SDK** (`@fhevm/sdk`) that wraps all necessary FHEVM packages and provides a wagmi-like API structure. Developers can use it with any frontend framework (React, Next.js, Vue, Node.js) with minimal setup.

### Key Features

✅ **Framework Agnostic** - Works with React, Next.js, Vue, Node.js, or any frontend setup
✅ **Unified API** - Consistent interface across all frameworks
✅ **Minimal Setup** - Get started in less than 10 lines of code
✅ **Complete Flow** - Covers initialization, encryption, decryption, and contract interaction
✅ **Modular Design** - Clean, reusable components for any encryption/decryption scenario
✅ **Type-Safe** - Full TypeScript support with comprehensive types
✅ **EIP-712 Signatures** - Built-in support for secure decryption with user signatures

---

## 📦 Monorepo Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Universal FHEVM SDK (framework-agnostic)
│       ├── src/
│       │   ├── core/           # Core functionality
│       │   │   ├── client.ts   # FHEVM client
│       │   │   ├── encryption.ts
│       │   │   ├── decryption.ts
│       │   │   └── types.ts
│       │   ├── react/          # React-specific hooks
│       │   │   ├── hooks.ts
│       │   │   └── provider.tsx
│       │   └── index.ts
│       └── package.json
│
├── examples/
│   ├── nextjs/                 # Next.js example (Required)
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   │
│   ├── react/                  # React example
│   │   ├── src/
│   │   └── package.json
│   │
│   └── auction-dapp/           # Real-world example (from existing dapp)
│       ├── src/
│       └── package.json
│
├── contracts/                  # Solidity contracts
│   ├── Counter.sol
│   └── ConfidentialAuction.sol
│
├── package.json               # Root package.json (monorepo)
├── demo.mp4                   # Video demonstration
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Installation (from root)

```bash
# Clone the repository
git clone https://github.com/your-repo/fhevm-react-template.git
cd fhevm-react-template

# Install all packages
npm install

# Build SDK
npm run build:sdk

# Compile contracts
npm run compile

# Deploy contracts
npm run deploy
```

### Using the SDK (< 10 lines)

```typescript
import { createFhevmClient, createEncryptedInput, userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Initialize (1 line)
const provider = new ethers.BrowserProvider(window.ethereum);
const client = await createFhevmClient({ provider });

// Encrypt input (3 lines)
const input = await createEncryptedInput(client, contractAddress, userAddress);
input.add64(1000);
const { handles, inputProof } = await input.encrypt();

// Decrypt result (2 lines)
const signature = await userDecrypt(client, contractAddress, handle, signer);
const decrypted = await signature.decrypt();
```

---

## 📋 Complete Setup Flow

### 1. Install All Packages

```bash
npm install
```

This installs:
- SDK dependencies in `packages/fhevm-sdk`
- Example dependencies in `examples/*`
- Contract tools (Hardhat, etc.)

### 2. Compile & Deploy Contracts

```bash
# Compile Solidity contracts
npm run compile

# Deploy to Sepolia
npm run deploy
```

This generates:
- Contract ABIs in `artifacts/`
- Deployment addresses
- TypeScript types

### 3. Start Frontend

```bash
# Next.js example
npm run dev:nextjs

# React example
npm run dev:react

# Auction dApp example
npm run dev:auction
```

---

## 🔧 SDK Usage

### Core API

#### Initialize Client

```typescript
import { createFhevmClient } from '@fhevm/sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const client = await createFhevmClient({
  provider,
  network: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
  }
});
```

#### Encrypt Input

```typescript
import { createEncryptedInput } from '@fhevm/sdk';

// Create encrypted input builder
const input = await createEncryptedInput(client, contractAddress, userAddress);

// Add encrypted values
input.add8(42);               // euint8
input.add32(1000000);         // euint32
input.add64(BigInt(1000));    // euint64
input.addBool(true);          // ebool
input.addAddress('0x123...');  // eaddress

// Encrypt and get proof
const { handles, inputProof } = await input.encrypt();

// Use in contract call
await contract.myFunction(handles[0], inputProof);
```

#### User Decrypt (with EIP-712)

```typescript
import { userDecrypt } from '@fhevm/sdk';

// Request decryption with signature
const result = await userDecrypt(client, {
  contractAddress: '0x123...',
  handle: encryptedValue,
  userAddress: signer.address,
  signer: signer,
});

console.log('Decrypted value:', result.value);
```

#### Public Decrypt (Oracle)

```typescript
import { publicDecrypt } from '@fhevm/sdk';

// Oracle-based decryption
const result = await publicDecrypt(client, {
  contractAddress: '0x123...',
  handle: encryptedValue,
});

console.log('Decrypted value:', result.value);
```

---

## ⚛️ React Integration

### Setup Provider

```tsx
import { FhevmProvider } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      <YourApp />
    </FhevmProvider>
  );
}
```

### Use Hooks

```tsx
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function Counter() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const { decrypt, isDecrypting } = useDecrypt(client);

  const incrementEncrypted = async () => {
    const { handles, inputProof } = await encrypt(
      contractAddress,
      (input) => input.add32(1)
    );

    await contract.increment(handles[0], inputProof);
  };

  const getDecryptedValue = async () => {
    const result = await decrypt({
      contractAddress,
      handle: encryptedCounter,
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

---

## 🎨 Examples

### Next.js Example

Location: `examples/nextjs`

Features:
- App Router (Next.js 14+)
- Server Components + Client Components
- SDK integration
- TypeScript

```bash
cd examples/nextjs
npm run dev
```

### React Example

Location: `examples/react`

Features:
- Vite + React
- React Router
- SDK integration
- TypeScript

```bash
cd examples/react
npm run dev
```

### Auction dApp Example

Location: `examples/auction-dapp`

Real-world example using:
- Confidential bidding
- Artifact authentication
- FHE encryption for bids
- Complete auction lifecycle

```bash
cd examples/auction-dapp
npm run dev
```

---

## 🌐 Framework Support

### React

```tsx
import { FhevmProvider, useFhevmClient } from '@fhevm/sdk/react';
```

### Vue (Optional)

```typescript
import { useFhevm } from '@fhevm/sdk/vue';
```

### Node.js

```typescript
import { createFhevmClient } from '@fhevm/sdk';
// No React/Vue dependencies required
```

### Next.js

```tsx
import { FhevmProvider } from '@fhevm/sdk/react';
// Works with App Router and Pages Router
```

---

## 📚 API Reference

### Core Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `createFhevmClient` | Initialize FHEVM client | `config: FhevmClientConfig` |
| `createEncryptedInput` | Create encrypted input builder | `client, contractAddress, userAddress` |
| `userDecrypt` | Decrypt with user signature (EIP-712) | `client, request` |
| `publicDecrypt` | Oracle-based decryption | `client, request` |
| `getPublicKey` | Get contract's public key | `client, contractAddress` |

### React Hooks

| Hook | Description | Return |
|------|-------------|--------|
| `useFhevmClient` | Get FHEVM client instance | `FhevmClient` |
| `useEncrypt` | Encrypt values | `{ encrypt, isEncrypting, error }` |
| `useDecrypt` | Decrypt values | `{ decrypt, isDecrypting, error }` |
| `useContract` | Contract helper with types | `{ contract, methods }` |

### Types

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
}
```

---

## 🔐 Security

### EIP-712 Signature

The SDK uses EIP-712 typed signatures for secure decryption:

```typescript
const signature = await signer._signTypedData(
  domain,
  types,
  {
    contractAddress,
    handle,
    userAddress,
  }
);
```

### Access Control

Decryption respects contract-level ACL (Access Control List):
- Users can only decrypt their own data
- Contract owner has specific permissions
- Oracle provides public decryption when authorized

---

## 🧪 Testing

```bash
# Test SDK
npm run test:sdk

# Test examples
npm run test:examples

# Test contracts
npm run test:contracts

# Full test suite
npm test
```

---

## 📖 Documentation

- [SDK Documentation](./packages/fhevm-sdk/README.md)
- [Next.js Example](./examples/nextjs/README.md)
- [React Example](./examples/react/README.md)
- [Auction dApp](./examples/auction-dapp/README.md)
- [Contract Documentation](./contracts/README.md)

---

## 🎥 Video Demo

**demo.mp4** includes:
1. Setup process (installing, compiling, deploying)
2. SDK initialization and usage
3. Encryption demo
4. Decryption demo (user + public)
5. Next.js example walkthrough
6. React example walkthrough
7. Auction dApp demo
8. Design choices explanation

---

## 🏗️ Development

### Build SDK

```bash
npm run build:sdk
```

### Watch Mode

```bash
npm run dev:sdk
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

---

## 📊 Evaluation Criteria

### ✅ Usability
- **Installation**: Single `npm install` from root
- **Setup**: < 10 lines of code to start
- **Documentation**: Comprehensive with examples

### ✅ Completeness
- **Initialization**: `createFhevmClient`
- **Encryption**: `createEncryptedInput` with all FHE types
- **Decryption**: Both `userDecrypt` (EIP-712) and `publicDecrypt`
- **Contract Interaction**: Helper functions and React hooks

### ✅ Reusability
- **Framework Agnostic**: Core is independent
- **Modular**: Separate modules for React, Vue, etc.
- **Clean API**: Wagmi-like structure

### ✅ Documentation
- Detailed README
- API reference
- Code examples for each framework
- Video demonstration

### ✅ Creativity (Bonus)
- Multiple framework examples (Next.js, React, Node.js)
- Real-world dApp example
- TypeScript throughout
- Monorepo structure with shared SDK

---

## 🚀 Deployment

### SDK Package

```bash
# Publish to npm
cd packages/fhevm-sdk
npm publish
```

### Examples

**Next.js**: [https://fhevm-nextjs.vercel.app](https://fhevm-nextjs.vercel.app)
**React**: [https://fhevm-react.vercel.app](https://fhevm-react.vercel.app)
**Auction**: [https://fhevm-auction.vercel.app](https://fhevm-auction.vercel.app)

---

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama** - For FHEVM technology and bounty program
- **fhevmjs** - Core FHEVM library
- **wagmi** - API structure inspiration
- **Community** - GitHub issues and feedback

---

## 🔗 Links

- **Zama FHEVM Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **fhevmjs**: [github.com/zama-ai/fhevmjs](https://github.com/zama-ai/fhevmjs)
- **Bounty**: [github.com/zama-ai/bounty](https://github.com/zama-ai/bounty)

---

<div align="center">

**Built for Zama FHEVM SDK Bounty**

🔐 Universal SDK | ⚛️ Framework Agnostic | 🚀 Developer Friendly

Made with ❤️ for the FHEVM community

</div>

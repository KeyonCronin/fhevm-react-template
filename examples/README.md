# FHEVM SDK Examples

This directory contains complete example applications demonstrating the FHEVM SDK integration with different frameworks.

## Examples Overview

### 1. Next.js Example
**Path:** `nextjs/`
**Framework:** Next.js 14 with App Router

A comprehensive Next.js application showcasing:
- Complete SDK integration with React hooks
- Server and Client Components
- API routes for FHE operations
- Encryption and decryption demos
- Real-world use cases (Banking, Medical)
- Key management
- TypeScript throughout

**Features:**
- ✅ FHE Client initialization
- ✅ Encrypted input creation
- ✅ User decryption with EIP-712 signatures
- ✅ Public decryption
- ✅ Homomorphic computations
- ✅ UI components library
- ✅ Custom hooks for FHE operations

**Start:**
```bash
cd nextjs
npm install
npm run dev
```

Then open http://localhost:3000

---

### 2. React + Vite Example
**Path:** `react/`
**Framework:** React 18 with Vite

A lightweight, fast React application demonstrating:
- SDK integration with React hooks
- Fast Hot Module Replacement (HMR)
- Encrypted counter demonstration
- Wallet connection flow
- Clean, minimal setup

**Features:**
- ✅ FHE Provider setup
- ✅ Encryption operations
- ✅ Decryption with signatures
- ✅ Wallet integration
- ✅ TypeScript support

**Start:**
```bash
cd react
npm install
npm run dev
```

Then open http://localhost:5173

---

### 3. Auction dApp Example
**Path:** `auction-dapp/`
**Framework:** React with Vite

A real-world confidential auction application showing:
- Privacy-preserving bidding mechanism
- Encrypted bid submission using FHE
- Contract integration patterns
- Complete user authentication flow
- Auction lifecycle management

**Features:**
- ✅ Confidential bid submission
- ✅ Privacy-preserving auction logic
- ✅ Real contract integration
- ✅ User authentication
- ✅ Auction state management

**Start:**
```bash
cd auction-dapp
npm install
npm run dev
```

Then open http://localhost:5173

---

### 4. ConfidentialArtifactAuction
**Path:** `ConfidentialArtifactAuction/`
**Framework:** Legacy example

An artifact auction implementation (maintained for compatibility).

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MetaMask or compatible Web3 wallet
- Basic understanding of React and TypeScript

### Installation

1. **Install all dependencies from root:**
```bash
cd ..  # Go to repository root
npm install
```

2. **Build the SDK:**
```bash
npm run build:sdk
```

3. **Run any example:**
```bash
# Next.js
npm run dev:nextjs

# React
npm run dev:react

# Auction dApp
npm run dev:auction
```

## SDK Integration Pattern

All examples follow this integration pattern:

### 1. Install SDK
```bash
npm install @fhevm/sdk
```

### 2. Initialize Client (React)
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

### 3. Use Hooks
```tsx
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function Component() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  // Your component logic...
}
```

## Example Structure

Each example follows a consistent structure:

```
example-name/
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks (optional)
│   ├── lib/                # Utilities (optional)
│   ├── types/              # TypeScript types (optional)
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies
├── README.md               # Example-specific docs
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Build config (for Vite)
```

## Framework-Specific Notes

### Next.js
- Uses App Router (Next.js 13+)
- Demonstrates both Client and Server Components
- Includes API routes for server-side operations
- Full TypeScript support

### React + Vite
- Faster development with HMR
- Minimal configuration
- Great for prototyping
- Lightweight bundle

### Real-world dApp
- Production-ready patterns
- Error handling
- Loading states
- User feedback

## Learning Path

1. **Start with React example** - Understand basic SDK usage
2. **Explore Next.js example** - See advanced patterns and API routes
3. **Study Auction dApp** - Learn real-world application patterns

## Common Patterns

### Encryption Pattern
```tsx
const { encrypt } = useEncrypt();

const encrypted = await encrypt(
  contractAddress,
  userAddress,
  (input) => {
    input.add32(1000);
    input.addBool(true);
  }
);
```

### Decryption Pattern
```tsx
const { decrypt } = useDecrypt();

const result = await decrypt({
  contractAddress,
  handle: encryptedHandle,
  userAddress,
  signer,
});
```

## Troubleshooting

### MetaMask Not Detected
Make sure MetaMask is installed and the page is reloaded after installation.

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### SDK Not Found
```bash
# Build SDK from root
cd ..
npm run build:sdk
```

## Contributing

Want to add a new example? See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Resources

- [SDK Documentation](../packages/fhevm-sdk/README.md)
- [Main README](../README.md)
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [fhevmjs](https://github.com/zama-ai/fhevmjs)

## License

MIT - see [LICENSE](../LICENSE) for details.

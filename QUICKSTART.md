# Quick Start Guide

Get started with the Universal FHEVM SDK in under 5 minutes.

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH (optional, for deployment)

## Installation

```bash
# Clone repository
git clone https://github.com/KeyonCronin/FHEArtifactAuction.git
cd FHEArtifactAuction/fhevm-react-template

# Install all dependencies
npm install
```

## Quick Start (< 10 lines)

### Core Usage (Any Framework)

```typescript
import { createFhevmClient, createEncryptedInput, userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

// 1. Initialize client
const provider = new ethers.BrowserProvider(window.ethereum);
const client = await createFhevmClient({ provider });

// 2. Encrypt input
const input = await createEncryptedInput(client, contractAddress, userAddress);
input.add64(1000);
const { handles, inputProof } = await input.encrypt();

// 3. Decrypt result
const result = await userDecrypt(client, { contractAddress, handle, signer });
console.log('Value:', result.value);
```

### React Usage

```tsx
import { FhevmProvider, useFhevmClient, useEncrypt } from '@fhevm/sdk/react';

function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      <YourApp />
    </FhevmProvider>
  );
}

function YourApp() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, (input) => {
      input.add32(42);
    });
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Run Examples

### Next.js Example

```bash
npm run dev:nextjs
```

Open [http://localhost:3000](http://localhost:3000)

### React + Vite Example

```bash
npm run dev:react
```

Open [http://localhost:5173](http://localhost:5173)

### Auction dApp Example

```bash
npm run dev:auction
```

Open [http://localhost:5173](http://localhost:5173) (different port if React example is running)

## Build SDK

```bash
npm run build:sdk
```

## Compile Contracts

```bash
# From root directory (../..)
cd ../..
npm run compile
```

## Deploy Contracts

```bash
# From root directory
npm run deploy:sepolia
```

## Project Structure

```
fhevm-react-template/
├── packages/fhevm-sdk/    # Universal SDK
├── examples/
│   ├── nextjs/            # Next.js example
│   ├── react/             # React + Vite example
│   └── auction-dapp/      # Auction dApp example
├── contracts/             # Solidity contracts
└── README.md             # Full documentation
```

## Next Steps

1. Read the [Main README](README.md) for complete documentation
2. Check [SDK Documentation](packages/fhevm-sdk/README.md) for API reference
3. Explore [Next.js Example](examples/nextjs/README.md)
4. Try the [React Example](examples/react/README.md)
5. Build the [Auction dApp](examples/auction-dapp/README.md)
6. Watch the video demo (demo.mp4)

## Common Commands

```bash
npm install               # Install dependencies
npm run build:sdk         # Build SDK package
npm run dev:nextjs        # Run Next.js example
npm run dev:react         # Run React + Vite example
npm run dev:auction       # Run auction dApp
npm run compile           # Compile contracts (from root)
npm run deploy:sepolia    # Deploy to Sepolia (from root)
npm run lint              # Lint all packages
```

## Troubleshooting

### "Module not found: @fhevm/sdk"

Build the SDK first:

```bash
npm run build:sdk
```

### "MetaMask not installed"

Install MetaMask browser extension and reload the page.

### "Network not supported"

Connect MetaMask to Sepolia testnet.

## Support

- GitHub Issues: https://github.com/KeyonCronin/FHEArtifactAuction/issues
- Documentation: [README.md](README.md)
- Video Demo: [DEMO.md](DEMO.md)

## License

MIT

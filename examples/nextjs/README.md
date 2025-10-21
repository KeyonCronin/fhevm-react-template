# FHEVM Next.js Example

Next.js 14 example application demonstrating FHEVM SDK integration with the App Router.

## Features

- Next.js 14 App Router
- React Server Components and Client Components
- FHEVM SDK integration
- TypeScript
- Encrypted counter demonstration
- Wallet connection

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- MetaMask or compatible wallet
- Sepolia testnet ETH (for contract interaction)

### Installation

From the monorepo root:

```bash
npm install
```

Or from this directory:

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
nextjs/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── providers.tsx        # FHEVM provider setup
│   └── globals.css          # Global styles
├── components/
│   ├── Counter.tsx          # Encrypted counter component
│   └── WalletConnect.tsx    # Wallet connection component
├── lib/
│   └── contracts.ts         # Contract configuration
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Usage

### 1. Connect Wallet

Click "Connect MetaMask" to connect your wallet.

### 2. Increment Counter

Enter a value and click "Increment" to encrypt and submit a value.

### 3. Decrypt Value

Click "Decrypt Value" to request decryption with your signature.

## SDK Integration

### Provider Setup

```tsx
// app/providers.tsx
import { FhevmProvider } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

export default function Providers({ children }) {
  const provider = new ethers.BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      {children}
    </FhevmProvider>
  );
}
```

### Using Hooks

```tsx
// components/Counter.tsx
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

export default function Counter() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const handleIncrement = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, (input) => {
      input.add32(value);
    });
    // Use encrypted.handles and encrypted.inputProof in contract call
  };

  return (
    <button onClick={handleIncrement} disabled={isEncrypting}>
      Increment
    </button>
  );
}
```

## Deployment

### Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
vercel deploy
```

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
```

### Contract Address

Update the contract address in `components/Counter.tsx` or use environment variables.

## Troubleshooting

### "MetaMask Required"

Make sure MetaMask is installed and enabled.

### "Failed to initialize FHEVM client"

Check that:
- You're connected to the correct network
- FHEVM contract is deployed
- Network configuration is correct

### Build Errors

If you encounter webpack errors:

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## License

MIT

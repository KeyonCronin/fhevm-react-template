# React + Vite FHEVM Example

React 18 example application with Vite demonstrating FHEVM SDK integration.

## Features

- React 18
- Vite for fast development
- FHEVM SDK integration
- TypeScript support
- Hot Module Replacement (HMR)
- Lightweight setup

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- MetaMask wallet

### Installation

From monorepo root:

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

Then open the application in your browser.

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
react/
├── src/
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── components/          # React components
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## SDK Integration

### Provider Setup

```tsx
import { FhevmProvider } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function App() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  if (!provider) return <div>Install MetaMask</div>;

  return (
    <FhevmProvider provider={provider}>
      <YourApp />
    </FhevmProvider>
  );
}
```

### Using Hooks

```tsx
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function Component() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, (input) => {
      input.add32(42);
    });
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt
    </button>
  );
}
```

## Vite Configuration

The project uses custom Vite configuration to handle FHEVM packages:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['fhevmjs'],
  },
});
```

## Comparison with Next.js Example

| Feature | React + Vite | Next.js |
|---------|-------------|---------|
| Setup | Simpler | More features |
| Build Time | Faster | Slower |
| HMR | Very fast | Fast |
| SSR/SSG | No | Yes |
| Routing | Manual | Built-in |
| Best For | SPAs | Full-stack apps |

## Why Vite?

- ⚡ Lightning-fast HMR
- 🚀 Instant server start
- 📦 Optimized builds
- 🔧 Simple configuration
- 🎯 Perfect for SPAs

## Troubleshooting

### "Module not found: @fhevm/sdk"

Build the SDK first:

```bash
cd ../../packages/fhevm-sdk
npm run build
```

Or from root:

```bash
npm run build:sdk
```

### "Cannot find module 'fhevmjs'"

Make sure fhevmjs is excluded in `vite.config.ts`:

```typescript
optimizeDeps: {
  exclude: ['fhevmjs'],
}
```

### Port Already in Use

Change port in `package.json`:

```json
"dev": "vite --port 5174"
```

## Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ directory to Netlify
```

### Deploy to GitHub Pages

```bash
npm run build
# Configure GitHub Pages to serve from dist/
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)

## License

MIT

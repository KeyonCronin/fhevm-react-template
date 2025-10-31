# FHEVM SDK Templates

This directory contains template projects demonstrating how to use the FHEVM SDK with different frameworks.

## Available Templates

### Next.js Template
Location: `../examples/nextjs`

A complete Next.js 14 application demonstrating:
- App Router architecture
- Server and Client Components
- FHEVM SDK integration
- Encrypted operations
- API routes for FHE operations

**Start the template:**
```bash
cd ../examples/nextjs
npm install
npm run dev
```

### React + Vite Template
Location: `../examples/react`

A lightweight React application with Vite demonstrating:
- Fast HMR development
- FHEVM SDK hooks
- Encrypted counter example
- Wallet integration

**Start the template:**
```bash
cd ../examples/react
npm install
npm run dev
```

### Auction dApp Template
Location: `../examples/auction-dapp`

A real-world confidential auction application demonstrating:
- Privacy-preserving bidding
- Encrypted bid submission
- Contract integration
- Complete user flow

**Start the template:**
```bash
cd ../examples/auction-dapp
npm install
npm run dev
```

## Template Structure

Each template follows a consistent structure:

```
template/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks (if applicable)
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript types
├── package.json        # Dependencies
├── README.md           # Template-specific docs
└── tsconfig.json       # TypeScript config
```

## Using Templates

### Option 1: Copy Template
```bash
cp -r examples/nextjs my-fhe-project
cd my-fhe-project
npm install
```

### Option 2: Use as Reference
Browse the examples directory and copy relevant code patterns into your existing project.

### Option 3: Start from Scratch
Install the SDK in your project:
```bash
npm install @fhevm/sdk
```

Then follow the [Quick Start Guide](../README.md#quick-start) in the main README.

## Framework Support

### Supported Frameworks
- ✅ Next.js (App Router & Pages Router)
- ✅ React (with Vite or Create React App)
- ✅ Vue 3 (via Vue adapter)
- ✅ Node.js (server-side)

### Coming Soon
- Angular
- Svelte
- Solid.js

## Contributing Templates

Want to contribute a template for a new framework? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Need Help?

- [SDK Documentation](../packages/fhevm-sdk/README.md)
- [Main README](../README.md)
- [Examples Documentation](../examples/README.md)

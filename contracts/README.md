# Smart Contracts

This directory contains Solidity smart contracts demonstrating FHEVM functionality.

## Contracts

### Counter.sol

A simple encrypted counter contract demonstrating basic FHEVM operations.

**Features:**
- Encrypted counter value using `euint32`
- Increment/decrement operations with FHE
- Owner-only set functionality
- Decryption request handling

**Usage Example:**
```solidity
// Deploy
Counter counter = new Counter();

// Increment by 5
counter.increment(5);

// Get encrypted value
euint32 value = counter.getCounter();

// Request decryption
counter.requestCounterDecryption();
```

### ConfidentialArtifactAuction.sol

A complete auction system with encrypted bids for artifact sales.

**Features:**
- Encrypted bid amounts using FHE
- Artifact authentication system
- Multiple concurrent auctions
- Automatic winner determination
- Seller earnings management

**Key Functions:**
- `createAuction()` - Start a new auction
- `authenticateArtifact()` - Verify artifact authenticity
- `placeBid()` - Submit encrypted bid
- `endAuction()` - Close auction and determine winner
- `getAuctionInfo()` - Query auction details

**Usage Example:**
```solidity
// Create auction
uint32 auctionId = auction.createAuction(
    "Rare Painting",
    "18th century masterpiece",
    "painting",
    1000000, // minimum bid
    86400,   // 24 hour duration
    1750,    // year created
    "Royal collection"
);

// Authenticate
auction.authenticateArtifact(auctionId);

// Place bid (encrypted)
auction.placeBid(auctionId, 1500000);

// End auction
auction.endAuction(auctionId);
```

## Compilation

```bash
# From monorepo root
npm run compile

# Or from this directory
npx hardhat compile
```

## Testing

```bash
# From monorepo root
npm test

# Specific contract tests
npm test -- --grep "Counter"
npm test -- --grep "Auction"
```

## Deployment

```bash
# Deploy to local network
npm run deploy

# Deploy to Sepolia
npm run deploy:sepolia
```

## FHE Operations

### Supported Types

- `euint8` - 8-bit encrypted integer
- `euint16` - 16-bit encrypted integer
- `euint32` - 32-bit encrypted integer
- `euint64` - 64-bit encrypted integer
- `euint128` - 128-bit encrypted integer
- `euint256` - 256-bit encrypted integer
- `ebool` - Encrypted boolean
- `eaddress` - Encrypted address

### Common Operations

```solidity
// Encryption
euint32 encrypted = FHE.asEuint32(value);

// Arithmetic
euint32 sum = FHE.add(a, b);
euint32 diff = FHE.sub(a, b);
euint32 product = FHE.mul(a, b);

// Comparison
ebool isGreater = FHE.gt(a, b);
ebool isEqual = FHE.eq(a, b);

// Permissions
FHE.allowThis(encrypted);           // Allow contract
FHE.allow(encrypted, address);      // Allow specific address

// Decryption Request
bytes32 ct = FHE.toBytes32(encrypted);
FHE.requestDecryption(cts, callback);
```

## Security Considerations

1. **Access Control**
   - Implement proper permission checks
   - Use modifiers for role-based access
   - Validate all inputs

2. **FHE Permissions**
   - Always set permissions after encryption
   - Use `FHE.allowThis()` for contract access
   - Use `FHE.allow()` for user access

3. **Decryption**
   - Only request decryption when necessary
   - Verify signatures in callback
   - Handle decryption failures

4. **Gas Optimization**
   - FHE operations are gas-intensive
   - Batch operations when possible
   - Use appropriate data types

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

MIT License - see [LICENSE](../LICENSE) file for details.

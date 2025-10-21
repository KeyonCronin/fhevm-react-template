// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Counter
 * @notice A simple encrypted counter demonstrating FHEVM basic operations
 * @dev Uses FHE encryption for counter value privacy
 */
contract Counter is SepoliaConfig {

    address public owner;
    euint32 private encryptedCounter;

    event CounterIncremented(address indexed user);
    event CounterDecremented(address indexed user);
    event CounterSet(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Initialize counter to 0
        encryptedCounter = FHE.asEuint32(0);
        FHE.allowThis(encryptedCounter);
    }

    /**
     * @notice Increment the encrypted counter by a specified amount
     * @param amount The amount to increment (encrypted)
     */
    function increment(uint32 amount) external {
        euint32 encryptedAmount = FHE.asEuint32(amount);
        encryptedCounter = FHE.add(encryptedCounter, encryptedAmount);

        // Set permissions
        FHE.allowThis(encryptedCounter);
        FHE.allow(encryptedCounter, msg.sender);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Decrement the encrypted counter by a specified amount
     * @param amount The amount to decrement (encrypted)
     */
    function decrement(uint32 amount) external {
        euint32 encryptedAmount = FHE.asEuint32(amount);
        encryptedCounter = FHE.sub(encryptedCounter, encryptedAmount);

        // Set permissions
        FHE.allowThis(encryptedCounter);
        FHE.allow(encryptedCounter, msg.sender);

        emit CounterDecremented(msg.sender);
    }

    /**
     * @notice Set the counter to a specific value
     * @param value The new value for the counter
     */
    function setCounter(uint32 value) external onlyOwner {
        encryptedCounter = FHE.asEuint32(value);

        // Set permissions
        FHE.allowThis(encryptedCounter);
        FHE.allow(encryptedCounter, owner);

        emit CounterSet(msg.sender);
    }

    /**
     * @notice Get the encrypted counter value
     * @dev Caller must have permission to decrypt
     * @return The encrypted counter value
     */
    function getCounter() external view returns (euint32) {
        return encryptedCounter;
    }

    /**
     * @notice Request decryption of the counter value
     * @dev Uses FHE decryption oracle
     */
    function requestCounterDecryption() external {
        bytes32 ct = FHE.toBytes32(encryptedCounter);
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = ct;

        FHE.requestDecryption(cts, this.processDecryptedCounter.selector);
    }

    /**
     * @notice Callback function for decryption results
     * @param requestId The request ID
     * @param cleartexts The decrypted values
     * @param signatures The signatures for verification
     */
    function processDecryptedCounter(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory signatures
    ) external {
        // Verify signatures
        FHE.checkSignatures(requestId, cleartexts, signatures);

        // Decode the decrypted value
        uint32[] memory decryptedValues = abi.decode(cleartexts, (uint32[]));

        // In a real application, you would store or emit this value
        // For this demo, we just verify it decoded successfully
        require(decryptedValues.length > 0, "Decryption failed");
    }
}

# Contributing Guidelines

Thank you for your interest in contributing to the Confidential Artifact Auction project! This document provides guidelines for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security Issues](#security-issues)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize the project's best interests

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

---

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Git
- Basic understanding of Solidity and Hardhat

### Initial Setup

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/FHEArtifactAuction.git
   cd FHEArtifactAuction
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run tests**
   ```bash
   npm test
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow the coding standards outlined below.

### 3. Test Your Changes

```bash
# Run tests
npm test

# Check coverage
npm run coverage

# Run linting
npm run lint

# Format code
npm run format
```

### 4. Commit Your Changes

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request via GitHub UI.

---

## Coding Standards

### Solidity Code

**Style Guide:**
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for all public functions
- 4-space indentation
- Maximum line length: 120 characters

**Example:**
```solidity
/**
 * @notice Creates a new confidential auction
 * @param artifactId Unique identifier for the artifact
 * @param duration Auction duration in seconds
 * @return auctionId The ID of the created auction
 */
function createAuction(
    uint256 artifactId,
    uint256 duration
) external onlyOwner returns (uint256 auctionId) {
    // Implementation
}
```

**Security:**
- Always use latest stable Solidity version
- Include reentrancy guards where needed
- Validate all inputs
- Use events for important state changes
- Follow checks-effects-interactions pattern

### JavaScript/TypeScript Code

**Style Guide:**
- ESLint configuration (see `.eslintrc.json`)
- Prettier formatting (see `.prettierrc.json`)
- 2-space indentation
- Use `const` by default, `let` when necessary
- Avoid `var`

**Example:**
```javascript
/**
 * Deploys the ConfidentialArtifactAuction contract
 * @returns {Promise<Contract>} Deployed contract instance
 */
async function deployAuction() {
  const [deployer] = await ethers.getSigners();
  const Auction = await ethers.getContractFactory("ConfidentialArtifactAuction");
  const auction = await Auction.deploy();
  return auction;
}
```

### Testing

**Test Structure:**
```javascript
describe("ContractName", function () {
  describe("FunctionName", function () {
    it("should behave as expected", async function () {
      // Arrange
      const input = setupInput();

      // Act
      const result = await contract.function(input);

      // Assert
      expect(result).to.equal(expected);
    });
  });
});
```

**Requirements:**
- Minimum 70% code coverage
- Test all edge cases
- Include negative test cases
- Test event emissions
- Test access control

---

## Testing Requirements

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific test file
npm test test/ConfidentialArtifactAuction.test.js

# With gas reporting
REPORT_GAS=true npm test

# Coverage report
npm run coverage
```

### Test Checklist

Before submitting a PR, ensure:

- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Test coverage meets minimum (70%)
- [ ] No console.log statements in tests
- [ ] Tests are well-documented

---

## Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(auction): add encrypted bid validation

Implements validation for encrypted bids to prevent
invalid submissions.

Closes #123
```

```
fix(deploy): correct network configuration

Fixed deployment script to properly handle network detection
on Sepolia testnet.
```

```
docs(readme): update installation instructions

Added troubleshooting section for common setup issues.
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically:
- Format code with Prettier
- Lint JavaScript with ESLint
- Lint Solidity with Solhint
- Compile contracts

If hooks fail, fix the issues before committing.

---

## Pull Request Process

### Before Submitting

1. **Update from main branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run format
   npm test
   npm run coverage
   ```

3. **Update documentation**
   - Update README if needed
   - Add/update JSDoc comments
   - Update relevant .md files

4. **Check for sensitive data**
   - No private keys
   - No API keys
   - No personal information

### PR Template

Use this template for your PR description:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for changes
- [ ] All tests pass
```

### Review Process

1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Verify changes work as expected
4. **Documentation**: Ensure docs are updated
5. **Merge**: Squash and merge when approved

### After Merge

- Delete your branch
- Update your local repository
- Close related issues

---

## Security Issues

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead:

1. **Email**: Send details to security@example.com (update with actual email)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Security Review Process

1. **Acknowledgment**: Within 48 hours
2. **Assessment**: Within 7 days
3. **Fix Development**: Priority-based timeline
4. **Disclosure**: After fix is deployed

### Responsible Disclosure

We follow responsible disclosure:
- Report privately first
- Allow time for fix
- Coordinate public disclosure
- Credit reporters (if desired)

---

## Development Best Practices

### Gas Optimization

- Use appropriate data types
- Minimize storage operations
- Batch operations when possible
- Use events instead of storage for historical data
- Consider using libraries for common operations

### Security Considerations

- Follow [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- Use OpenZeppelin contracts when possible
- Implement proper access control
- Validate all inputs
- Test thoroughly
- Consider edge cases

### Documentation

- Comment complex logic
- Use NatSpec for all public functions
- Keep README updated
- Document deployment process
- Maintain CHANGELOG

---

## Questions and Support

### Getting Help

- **Documentation**: Check README and other docs first
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Reach out to maintainers

### Useful Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in relevant documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Your contributions make this project better. We appreciate your time and effort! 🎉

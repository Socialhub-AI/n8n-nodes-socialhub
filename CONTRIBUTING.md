# Contributing to n8n-nodes-socialhub

Thank you for your interest in contributing to the SocialHub n8n node! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm
- n8n (for testing)

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/n8n-nodes-socialhub.git
   cd n8n-nodes-socialhub
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

4. Build the project:
   ```bash
   npm run build
   # or
   pnpm build
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public methods and classes

### Testing

- Test your changes thoroughly
- Ensure all existing tests pass: `npm test`
- Add tests for new functionality
- Test with different n8n versions when possible

### Commit Messages

Use clear and descriptive commit messages:
- `feat: add new operation for customer management`
- `fix: resolve authentication token refresh issue`
- `docs: update README with new examples`
- `refactor: improve error handling in member operations`

## Types of Contributions

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- n8n version and environment details
- Error messages or logs

### Feature Requests

For new features:
- Describe the use case
- Explain why it would be valuable
- Provide examples if possible
- Consider backward compatibility

### Code Contributions

1. **Create an Issue**: For significant changes, create an issue first to discuss the approach
2. **Create a Branch**: Use a descriptive branch name (e.g., `feature/add-loyalty-points`, `fix/auth-token-refresh`)
3. **Make Changes**: Follow the coding guidelines
4. **Test**: Ensure your changes work correctly
5. **Submit PR**: Create a pull request with a clear description

## Pull Request Process

1. Update documentation if needed
2. Add or update tests for your changes
3. Ensure the build passes: `npm run build`
4. Update CHANGELOG.md if applicable
5. Request review from maintainers

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
```

## API Guidelines

### Adding New Operations

When adding new SocialHub API operations:

1. **Follow Existing Patterns**: Use the same structure as existing operations
2. **Parameter Validation**: Validate required parameters
3. **Error Handling**: Provide meaningful error messages
4. **Documentation**: Update README with new operation details
5. **Examples**: Add usage examples

### Authentication

- Never hardcode credentials
- Use the existing credential system
- Handle token refresh gracefully
- Provide clear error messages for auth failures

## Documentation

- Keep README files up to date
- Add examples for new features
- Update API documentation
- Include both English and Chinese documentation when possible

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct

## Getting Help

- Check existing issues and documentation
- Ask questions in GitHub discussions
- Contact maintainers for complex issues

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Release notes for major features

Thank you for contributing to make this project better! 🚀
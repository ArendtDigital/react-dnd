# React-DND Development Guide

This guide explains how to develop, test, and maintain the React-DND package.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Git

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/ArendtDigital/react-dnd.git
cd react-dnd

# Install dependencies
npm install

# Run the development environment
npm run dev
```

## 🧪 Testing Strategy

### 1. Unit Tests
Unit tests verify individual components and functions work correctly in isolation.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Files:**
- `tests/DragDropProvider.test.tsx` - Tests the main provider component
- `tests/Draggable.test.tsx` - Tests draggable functionality
- `tests/integration.test.tsx` - Tests complete drag-and-drop workflows

### 2. Integration Tests
Integration tests verify that components work together correctly.

```bash
# Run integration tests
npm test -- --testPathPattern=integration
```

**What Integration Tests Cover:**
- Complete drag-and-drop operations
- Multi-item interactions
- State management
- Event handling
- Accessibility features

### 3. Manual Testing with Examples
The examples serve as both documentation and manual testing tools.

```bash
# Start examples server
npm run examples:dev

# Or use the development script
node scripts/dev-examples.js examples
```

**Testing Checklist:**
- [ ] Basic sortable list works
- [ ] Word bank functionality works
- [ ] Kanban board works
- [ ] useDragDrop hook works
- [ ] Touch events work on mobile
- [ ] Keyboard navigation works
- [ ] Accessibility features work

### 4. Browser Testing
Test the examples in different browsers:

**Required Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Testing Tools:**
- BrowserStack (for cross-browser testing)
- Chrome DevTools (for debugging)
- React DevTools (for component inspection)

## 🔧 Development Workflow

### 1. Making Changes
```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make your changes
# ...

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Build the library
npm run build
```

### 2. Testing Your Changes
```bash
# Run full validation
npm run validate

# Test examples with your changes
npm run examples:dev

# Run specific tests
npm test -- --testNamePattern="Draggable"
```

### 3. Commit and Push
```bash
# Add your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new drag mode support"

# Push to your branch
git push origin feature/new-feature
```

## 📦 Package Management

### 1. Version Management
```bash
# Check current version
npm version

# Bump patch version (bug fixes)
npm version patch

# Bump minor version (new features)
npm version minor

# Bump major version (breaking changes)
npm version major
```

### 2. Publishing
```bash
# Build and test before publishing
npm run validate
npm run build

# Publish to npm
npm publish

# Or publish with specific tag
npm publish --tag beta
```

### 3. Pre-publish Checklist
- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Examples work correctly
- [ ] Documentation is updated
- [ ] Version is bumped
- [ ] CHANGELOG is updated

## 🐛 Debugging

### 1. Common Issues

**Examples not loading:**
```bash
# Check if dependencies are installed
npm install

# Check if build is up to date
npm run build

# Check browser console for errors
```

**Tests failing:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- tests/Draggable.test.tsx
```

**Build errors:**
```bash
# Clean build directory
npm run clean

# Rebuild
npm run build

# Check TypeScript errors
npm run type-check
```

### 2. Debugging Tools

**React DevTools:**
- Install React DevTools browser extension
- Use Components tab to inspect component hierarchy
- Use Profiler tab to check performance

**Chrome DevTools:**
- Use Console tab for error messages
- Use Network tab to check for failed requests
- Use Elements tab to inspect DOM structure

**Jest Debugging:**
```bash
# Run tests in debug mode
npm test -- --debug

# Run specific test with debugging
npm test -- --testNamePattern="Draggable" --verbose
```

## 🔄 Continuous Integration

### GitHub Actions
The repository includes GitHub Actions workflows that:

1. **Run tests** on every push and pull request
2. **Check code quality** with linting and type checking
3. **Build the package** to ensure it compiles correctly
4. **Deploy examples** to GitHub Pages (if configured)

### Local CI Simulation
```bash
# Run the same checks as CI
npm run validate
npm run build
npm test -- --coverage --watchAll=false
```

## 📚 Documentation

### 1. Code Documentation
- Use JSDoc comments for functions and components
- Include TypeScript types for all public APIs
- Add examples in comments for complex functionality

### 2. README Updates
- Update README.md when adding new features
- Include code examples for new functionality
- Update installation instructions if needed

### 3. API Documentation
- Keep API documentation in sync with code changes
- Include migration guides for breaking changes
- Document deprecation notices

## 🚀 Performance Monitoring

### 1. Bundle Size
```bash
# Check bundle size
npm run build
# Check dist/ folder for file sizes
```

### 2. Runtime Performance
- Use React DevTools Profiler
- Monitor drag operation performance
- Check for memory leaks in long-running applications

### 3. Performance Testing
```bash
# Run performance tests (if available)
npm run test:perf
```

## 🔒 Security

### 1. Dependency Management
```bash
# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix

# Update dependencies
npm update
```

### 2. Code Security
- Avoid using `dangerouslySetInnerHTML`
- Validate all user inputs
- Use Content Security Policy headers in examples

## 🤝 Contributing

### 1. Issue Management
- Use GitHub Issues for bug reports and feature requests
- Label issues appropriately (bug, enhancement, documentation)
- Assign issues to maintainers

### 2. Pull Request Process
1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Update documentation
5. Run full validation
6. Submit pull request

### 3. Code Review
- Review code for correctness
- Check test coverage
- Verify documentation updates
- Test examples manually

## 📈 Monitoring and Maintenance

### 1. Regular Tasks
- [ ] Weekly: Check for dependency updates
- [ ] Monthly: Review and update documentation
- [ ] Quarterly: Performance audit
- [ ] Annually: Major version review

### 2. Metrics to Track
- Download counts on npm
- GitHub stars and forks
- Issue response time
- Test coverage percentage
- Bundle size trends

### 3. Community Management
- Respond to issues promptly
- Help users with questions
- Review and merge pull requests
- Maintain a welcoming environment

## 🆘 Getting Help

### 1. Internal Resources
- Check existing issues on GitHub
- Review the codebase
- Run tests to reproduce issues

### 2. External Resources
- React documentation
- TypeScript documentation
- Jest testing framework docs
- npm package management docs

### 3. Contact Information
- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For questions and general discussion
- Email: For security issues or private matters

---

This guide should help you maintain and develop the React-DND package effectively. Remember to keep it updated as the project evolves! 
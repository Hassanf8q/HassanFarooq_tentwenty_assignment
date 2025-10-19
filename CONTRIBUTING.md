# Contributing to HassanFarooq Movie Booking App

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- React Native CLI
- iOS: Xcode 14+
- Android: Android Studio with SDK 33+

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/hassanfarooq-movie-booking-app.git`
3. Install dependencies: `npm install`
4. Set up environment variables (copy `.env.example` to `.env`)
5. For iOS: `cd ios && pod install && cd ..`

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types when possible
- Use strict type checking

### React Native Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow React Native naming conventions

### Code Formatting
- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

## 🧪 Testing

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for API calls
- Test component rendering and user interactions
- Maintain good test coverage

## 📱 Platform Considerations

### iOS
- Test on different iOS versions
- Ensure proper safe area handling
- Test status bar behavior
- Verify gesture handling

### Android
- Test on different Android versions
- Check material design compliance
- Verify navigation behavior
- Test on different screen sizes

## 🔧 Development Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/refactor-description` - Code refactoring

### Commit Messages
Use conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Update documentation if needed
5. Run linting and tests
6. Submit a pull request

## 🐛 Bug Reports

When reporting bugs, please include:
- Device information (iOS/Android version)
- App version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## 💡 Feature Requests

When suggesting features:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Provide mockups if possible

## 📚 Documentation

### Code Documentation
- Document complex algorithms
- Add JSDoc comments for functions
- Update README for new features
- Keep API documentation current

### User Documentation
- Update user guides for new features
- Maintain troubleshooting guides
- Keep installation instructions current

## 🔒 Security

### Security Considerations
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Follow OWASP mobile security guidelines

### Reporting Security Issues
- Report security issues privately
- Use GitHub's security advisory feature
- Do not create public issues for security vulnerabilities

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Error handling enhancements
- Test coverage improvements

### Medium Priority
- UI/UX improvements
- New features
- Documentation updates
- Code refactoring

### Low Priority
- Minor bug fixes
- Code style improvements
- Dependency updates

## 📞 Getting Help

### Communication Channels
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for general questions
- Pull Request comments for code reviews

### Code Review Process
- All code must be reviewed before merging
- Address review comments promptly
- Be respectful and constructive in reviews
- Ask questions if something is unclear

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HassanFarooq Movie Booking App! 🎬

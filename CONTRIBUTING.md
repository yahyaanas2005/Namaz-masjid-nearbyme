# Contributing to PrayerTime Navigator

First off, thank you for considering contributing to PrayerTime Navigator! It's people like you that make this app a great tool for the Muslim community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, device, app version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any similar features in other apps if applicable**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear commit message
6. Update documentation if needed

## Development Process

### Setting Up Development Environment

1. Follow the setup instructions in [SETUP.md](SETUP.md)
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Coding Guidelines

#### TypeScript/JavaScript

* Use TypeScript for type safety
* Follow ESLint rules configured in the project
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused

#### React Native

* Use functional components with hooks
* Follow React best practices
* Keep components reusable
* Use proper prop types
* Implement proper error handling

#### Git Commit Messages

* Use present tense ("Add feature" not "Added feature")
* Use imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit first line to 72 characters
* Reference issues and pull requests liberally

Example:
```
Add prayer time validation feature

- Implement crowd density analysis
- Add validation threshold check
- Update mosque prayer times
- Emit real-time updates

Fixes #123
```

### Testing

* Write unit tests for new features
* Ensure all tests pass before submitting PR
* Test on both iOS and Android if possible
* Test with different screen sizes
* Test offline functionality

### Documentation

* Update README.md if needed
* Add JSDoc comments for functions
* Update API documentation for backend changes
* Include setup instructions for new dependencies

## Community

* Be respectful and inclusive
* Help others in the community
* Share your knowledge
* Provide constructive feedback

## Questions?

Feel free to open an issue with your question or contact us at support@prayertimenavigator.com

Thank you for contributing! 🙏

# Contributing to @nlabs/grid

First off, thank you for considering contributing to @nlabs/grid! 🎉

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (Angular version, browser, OS)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other libraries**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clear, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   - Use clear commit messages
   - Follow conventional commits format:
     - `feat:` New feature
     - `fix:` Bug fix
     - `docs:` Documentation changes
     - `style:` Code style changes (formatting, etc)
     - `refactor:` Code refactoring
     - `test:` Adding or updating tests
     - `chore:` Maintenance tasks

   Example:
   ```bash
   git commit -m "feat: add column pinning feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Link any related issues
   - Include screenshots for UI changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nlabs-grid.git
cd nlabs-grid

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build library
npm run build
```

## Project Structure

```
nlabs-grid/
├── src/
│   ├── data-grid/           # Main DataGrid component
│   ├── grid-template/       # Example usage
│   ├── interfaces/          # TypeScript interfaces
│   └── services/           # Services
├── docs/                   # Documentation
└── README.md              # Main documentation
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Define proper interfaces for complex objects
- Avoid `any` type when possible
- Use meaningful variable and function names

### Angular

- Follow Angular style guide
- Use standalone components
- Use `@if/@for` control flow (Angular 17+)
- Avoid template complexity, move logic to component

### CSS

- Use CSS custom properties for theming
- Follow BEM naming convention when applicable
- Keep styles scoped to components
- Support both light and dark themes

### Testing

- Write unit tests for new features
- Update tests when modifying existing features
- Aim for meaningful test coverage
- Test both happy paths and edge cases

## Documentation

- Update README.md for user-facing changes
- Add inline code comments for complex logic
- Include usage examples for new features
- Update API documentation

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainer:

**Cuma Köse** - [LinkedIn](https://www.linkedin.com/in/turkmvc/) | [GitHub](https://github.com/turkmvc)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

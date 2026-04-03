# Contributing to ECG Axis Lab

Thank you for your interest in contributing! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Provide constructive feedback
- Help others learn

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear title describing the bug
   - Step-by-step reproduction instructions
   - Expected vs actual behavior
   - System information (OS, Python version, Node version)
   - Screenshots or logs if applicable

### Suggesting Features

1. **Search existing issues** for similar suggestions
2. **Create a new issue** with:
   - Clear description of the feature
   - Motivation and use case
   - Proposed implementation approach (if you have ideas)
   - Examples of similar tools if relevant

### Writing Code

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ecg-axis-lab.git
   cd ecg-axis-lab
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Set up development environment (see [INSTALLATION.md](INSTALLATION.md))

#### Development Workflow

1. **Make changes** in your feature branch
2. **Write tests** for new functionality
3. **Run tests** to ensure nothing breaks:
   ```bash
   cd apps/api
   pytest tests/ -v
   ```
4. **Lint and format** code:
   - Python: Follow PEP 8
   - TypeScript: Use provided formatting

5. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new geometric reconstruction method"
   git commit -m "fix: correct vector projection calculation"
   git commit -m "docs: update math model documentation"
   ```

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Python Code Style

```python
"""Module docstring."""

from typing import Optional

def function_example(param1: str, param2: Optional[int] = None) -> dict:
    """
    Clear docstring explaining the function.
    
    Args:
        param1: Parameter description
        param2: Optional parameter description
        
    Returns:
        Dictionary with results
    """
    return {"result": param1}
```

#### TypeScript/React Code Style

```typescript
/**
 * Clear component description
 */
export const ComponentExample: React.FC<Props> = ({ prop1, prop2 }) => {
  return (
    <div>
      {prop1}
    </div>
  )
}
```

### Submitting a Pull Request

1. **Ensure all tests pass:**
   ```bash
   cd apps/api && pytest tests/ -v
   cd apps/web && npm run build
   ```

2. **Create pull request** with:
   - Clear title describing changes
   - Reference related issue (#123)
   - Description of what changed and why
   - Screenshots if UI changes
   - Any breaking changes clearly marked

3. **Respond to review** feedback promptly

4. **Approval and merge** by a maintainer

## Areas for Contribution

### High Priority

- [ ] File upload support (CSV/JSON)
- [ ] Beat annotation UI
- [ ] Advanced signal processing options
- [ ] Improved error messages

### Medium Priority

- [ ] Export functionality (PNG, PDF)
- [ ] Simplified UI for mobile
- [ ] Performance optimizations
- [ ] Additional demo datasets

### Lower Priority

- [ ] UI theme improvements
- [ ] Documentation enhancements
- [ ] Type safety improvements
- [ ] Accessibility features

## Testing Guidelines

### Backend Tests

```python
# test_newfeature.py
import pytest
from app.services.newfeature import function_under_test

def test_function_success_case():
    """Test normal operation."""
    result = function_under_test(valid_input)
    assert result is not None

def test_function_error_case():
    """Test error handling."""
    with pytest.raises(ValueError):
        function_under_test(invalid_input)
```

- **Aim for 80%+ coverage**
- Test normal cases and edge cases
- Use descriptive test names
- Include docstrings

### Minimum Test Requirements

- New functions must have tests
- Bug fixes should include regression test
- No decrease in overall coverage

## Documentation

Every contribution should include:

1. **Inline comments** for complex logic
2. **Docstrings** for all public functions
3. **Type hints** for function signatures
4. **README updates** if behavior changes
5. **Example usage** for new features

## Review Process

- **At least one approval** required
- **CI/CD checks** must pass
- **Code coverage** maintained
- **Documentation** complete

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR:** Breaking changes
- **MINOR:** New features
- **PATCH:** Bug fixes

## Questions?

- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development setup
- Review existing code for examples
- Ask in GitHub Discussions
- Review relevant documentation in `docs/`

Thank you for contributing! 🎉

```markdown
# vkkatariya.github.io Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill documents the development patterns and conventions used in the `vkkatariya.github.io` repository. The codebase is written in JavaScript without a specific framework, and follows clear conventions for file naming, code structure, and commit messages. This guide will help new contributors quickly align with the project's standards and workflows.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `myComponent.js`, `userProfile.test.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { myFunction } from './utils';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```javascript
    // utils.js
    export function myFunction() { /* ... */ }
    ```

### Commit Messages
- Follow **conventional commit** format.
- Common prefixes: `feat`, `chore`
- Example:
  ```
  feat: add user profile component
  chore: update dependencies
  ```

## Workflows

### Code Contribution
**Trigger:** When adding new features or making changes  
**Command:** `/contribute`

1. Create a new branch for your feature or fix.
2. Write code following the coding conventions.
3. Add or update tests as needed.
4. Commit changes using the conventional commit format.
5. Open a pull request for review.

### Testing
**Trigger:** Before submitting or merging code  
**Command:** `/test`

1. Identify or create test files matching the `*.test.*` pattern.
2. Run tests using the project's test runner (framework not specified; check project scripts or documentation).
3. Ensure all tests pass before merging.

## Testing Patterns

- Test files are named using the `*.test.*` pattern (e.g., `myFunction.test.js`).
- The testing framework is not specified; check for scripts or documentation in the repository.
- Example test file structure:
  ```javascript
  // myFunction.test.js
  import { myFunction } from './myFunction';

  test('should return correct value', () => {
    expect(myFunction(2)).toBe(4);
  });
  ```

## Commands
| Command      | Purpose                                   |
|--------------|-------------------------------------------|
| /contribute  | Start the code contribution workflow      |
| /test        | Run the test suite before merging changes |
```

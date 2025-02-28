# PlayWrightTest
Playwright Test Automation Framework using Typescript, can be used by both developer and software QA
## Features

- Basic Playwright tests
- Accessibility tests
- Load tests using k6

## Instructions

1. **Clone the repository**:
    ```bash
    git clone repo/PlayWrightTest
    cd PlayWrightTest
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run Playwright tests**:
    ```bash
    npx playwright test
    ```

4. **Run Accessibility tests**:
    ```bash
    npx playwright test --grep @accessibility
    ```

5. **Run Load tests using k6**:
    ```bash
    k6 run load-test.js
    ```

## Benefits

- **Comprehensive Testing**: Includes functional, accessibility, and load testing.
- **Developer Friendly**: Easy to set up and run tests.
- **Scalable**: Can be extended with more tests as needed.
- **Automated**: Supports CI/CD integration for automated testing.
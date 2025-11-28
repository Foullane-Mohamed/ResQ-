# Jest Testing Setup for ResQ Project

## ✅ What's Working

The Jest testing environment has been successfully configured for your ResQ project. Here's what has been implemented:

### 🧪 Test Configuration

- **Jest with TypeScript**: Full TypeScript support using `ts-jest`
- **React Testing Library**: For component testing
- **Test Environment**: jsdom for browser environment simulation
- **Coverage Reporting**: HTML, LCOV, and text formats
- **Path Mapping**: `@/` alias support in tests

### ✅ Passing Test Suites (2/8)

#### 1. Validation Tests (`src/lib/validations/authValidation.test.ts`)

- **13 passing tests** covering login and registration validation
- Tests for email validation, password requirements, role validation
- Comprehensive error handling scenarios

#### 2. Utility Functions Tests (`src/lib/utils.test.ts`)

- **13 passing tests** covering utility functions
- Class name merging with `cn()` function
- Date/time formatting functions
- Distance calculations between coordinates
- Nearest ambulance finding algorithm

## 🔧 Test Scripts Added to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --ci --reporters=default --reporters=jest-junit"
  }
}
```

## 📁 Test File Structure

```
src/
├── test/
│   ├── setup.ts          # Jest configuration and global mocks
│   └── utils.tsx         # Test utilities and providers
├── lib/
│   ├── utils.test.ts     # ✅ Utility function tests
│   └── validations/
│       └── authValidation.test.ts  # ✅ Validation tests
├── components/
│   ├── ui/
│   │   └── Button.test.tsx         # ⚠️ Needs fixes
│   └── LoginForm.test.tsx          # ⚠️ Needs fixes
├── services/
│   ├── authService.test.ts         # ⚠️ Needs fixes
│   └── incidentsService.test.ts    # ⚠️ Needs fixes
├── store/
│   └── authSlice.test.ts           # ⚠️ Needs fixes
└── hooks/
    └── useAuth.test.ts             # ⚠️ Needs fixes
```

## 🎯 Coverage Summary

- **Overall**: ~5% coverage (26 tests passing)
- **Utils**: 57% coverage
- **Validations**: 100% coverage for tested functions

## 🚧 Issues to Fix

### 1. Import/Export Issues

- Some test utilities need proper exports
- Path resolution issues in some test files

### 2. Type Issues

- Redux store typing needs refinement
- Mock function typing inconsistencies

### 3. Component Test Issues

- React component rendering setup needs adjustment
- Hook testing utilities need configuration

## 🏃‍♂️ Quick Start

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test -- src/lib/utils.test.ts
```

## 🛠 Test Examples

### Utility Function Test Example

```typescript
describe("calculateDistance", () => {
  it("should calculate distance between two points", () => {
    const distance = calculateDistance(48.8566, 2.3522, 45.764, 4.8357);
    expect(distance).toBeGreaterThan(380);
    expect(distance).toBeLessThan(410);
  });
});
```

### Validation Test Example

```typescript
describe("loginSchema", () => {
  it("should validate correct login data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

## 📋 Next Steps to Complete Testing

1. **Fix Import Issues**: Resolve export problems in test utilities
2. **Component Tests**: Fix React component test setup
3. **Service Tests**: Update API mocking for service tests
4. **Redux Tests**: Fix store typing issues
5. **Hook Tests**: Configure React Hook testing
6. **Add More Tests**: Expand coverage for critical functions
7. **Integration Tests**: Add end-to-end testing scenarios

## 🎯 CI/CD Integration

The test setup is ready for Jenkins integration with:

- Coverage reports (HTML + LCOV)
- JUnit XML reporting for CI
- Configurable test environments
- Watch mode for development

## 🔗 Useful Commands

```bash
# Run only validation tests
npm test -- --testPathPattern=validation

# Run with specific reporter
npm test -- --reporters=default --reporters=jest-junit

# Update snapshots
npm test -- --updateSnapshot

# Run tests matching pattern
npm test -- --testNamePattern="should validate"
```

This testing foundation provides a solid base for ensuring code quality and reliability in your ResQ ambulance dispatch system!

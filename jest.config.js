const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.tsx',
    'src/pages/**/*.tsx',
    '!src/pages/api/auth/*.ts',
    '!src/**/*.spec.tsx',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx'
  ],
  coverageReporters: ['lcov']
};

module.exports = createJestConfig(customJestConfig);

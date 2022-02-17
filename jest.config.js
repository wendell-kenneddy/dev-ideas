module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy'
  },
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

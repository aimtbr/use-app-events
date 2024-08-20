import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleNameMapper: {
    '^\\$(.*)': ['<rootDir>/src/$1', '<rootDir>/src/$1/index.ts'],
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['./src/lib/**'],
};

export default config;

/**
 * @returns {Promise<import('jest').Config>}
 */

const path = require('path');

module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs)'],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '^dexie$': require.resolve('dexie'),
    '^lodash-es/(.*)$': 'lodash/$1',
    '^react-i18next$': path.resolve(__dirname, 'react-i18next.js'),
    '^uuid$': '<rootDir>/node_modules/@openmrs/esm-patient-common-lib/node_modules/uuid/dist/index.js',
  },
  collectCoverageFrom: [
    '**/src/**/*.component.tsx',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/src/**/*.test.*',
    '!**/src/declarations.d.ts',
    '!**/e2e/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tools/setupTests.ts'],
  testPathIgnorePatterns: ['<rootDir>/packages/esm-form-entry-app', '<rootDir>/e2e'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};

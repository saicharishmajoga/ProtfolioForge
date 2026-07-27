module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  restoreMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.interface.ts',
    '!src/types/**/*.ts',
    '!src/server.ts',
    '!src/config/**/*.ts',
    '!src/database/**/*.ts',
    '!src/utils/swagger.ts'
  ],
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/'],
  moduleNameMapper: {
    '^hash\\.js$': 'hash.js',
    '(.+)\\.js': '$1',
    '^@/(.+)': '<rootDir>/src/$1',
    'test/(.+)': '<rootDir>/test/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

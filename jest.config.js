module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // map @/lib/supabase/client -> src/app/lib/supabase/client
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // optional for CSS imports
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json', // <-- use the Jest-specific tsconfig
    },
  },
};

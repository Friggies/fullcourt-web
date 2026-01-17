import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e', // Only run tests in the e2e folder
  timeout: 30 * 1000,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
  },
});

// To run the tests, use the command "npx playwright test" after starting the development server.

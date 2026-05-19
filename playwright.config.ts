import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e', // Only run tests in the e2e folder
  timeout: 30 * 1000,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      BYPASS_UPSTASH_RATE_LIMIT: 'true',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY:
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY:
        process.env.TURNSTILE_SECRET_KEY ?? '1x0000000000000000000000000000000AA',
    },
  },
});

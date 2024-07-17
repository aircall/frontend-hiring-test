import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */ export default defineConfig({
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: true
  }
});

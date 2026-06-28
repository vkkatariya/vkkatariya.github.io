// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { existsSync } = require('fs');

const localChromium = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    ...(existsSync(localChromium) ? { executablePath: localChromium } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node_modules/.bin/http-server . -p 3000 -c-1 --silent',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

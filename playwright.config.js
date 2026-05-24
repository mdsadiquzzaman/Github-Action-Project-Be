const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]], 
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium', 
      },
    },
  ],
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: true,
  },
  // Use a direct string path with the .js extension
  globalSetup: './e2e/global-setup.js', 
  outputFolder: 'test-results/', 
});
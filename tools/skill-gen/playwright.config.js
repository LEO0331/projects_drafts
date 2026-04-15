const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  outputDir: 'output/playwright/test-results',
  webServer: {
    command: 'python3 -m http.server 4173',
    cwd: __dirname,
    port: 4173,
    reuseExistingServer: true
  }
});

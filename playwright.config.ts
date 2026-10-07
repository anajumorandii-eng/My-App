import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Keep artifacts outside Vite's watched tree so traces cannot reload the app.
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR ?? join(tmpdir(), 'crivo-e2e-artifacts'),
  fullyParallel: false,
  // The development server transforms a large application graph on demand.
  // Serial projects keep Chromium and WebKit from competing for those first
  // transforms and make the fidelity gate deterministic on local Windows.
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? join(tmpdir(), 'crivo-e2e-report') }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
      launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] },
      video: 'off' as const,
    } : {}),
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1440, height: 900 },
    } },
    { name: 'mobile', use: { ...devices['iPhone 13'], ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { browserName: 'chromium' as const } : {}), viewport: { width: 390, height: 844 } } },
  ],
});

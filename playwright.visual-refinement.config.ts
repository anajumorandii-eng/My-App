import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';

/** Fluxos de comparação e movimento em desktop e WebKit com perfil de iPad. */
export default defineConfig({
  ...base,
  testMatch: 'visual-refinement-continuation.spec.ts',
  use: { ...base.use, launchOptions: undefined },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 },
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] } : undefined,
      },
    },
    {
      name: 'ipad-webkit',
      use: {
        ...devices['iPad Pro 11'], browserName: 'webkit',
        launchOptions: process.env.PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH
          ? { executablePath: process.env.PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH } : undefined,
      },
    },
  ],
});

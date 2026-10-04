import { defineConfig } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

// O build é executado antes deste comando, separado do navegador.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'visual-entrega-*.spec.ts',
  outputDir: 'tests/e2e/.artifacts/visual-production',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'tests/e2e/.artifacts/visual-production-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath, args: ['--no-sandbox'] } : undefined,
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/testSetup.ts'],
    clearMocks: true,
    // A suíte completa no Windows excedia esperas de renderização com mais processos.
    maxWorkers: 2,
    css: { include: [/katex/] },
    testTimeout: 15000,
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          // Both the `firebase/*` wrapper packages and their `@firebase/*`
          // implementations must land in the same chunk per sub-area, or
          // Rollup produces circular chunk dependencies between them.
          if (id.includes('firebase')) {
            if (id.includes('auth')) {
              return 'firebase-auth';
            }

            if (id.includes('firestore')) {
              return 'firebase-firestore';
            }

            return 'firebase-core';
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          return 'vendor';
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  test: {
    include: [
      'serverCalendar.test.ts',
      'src/features/availability/**/*.test.{ts,tsx}',
      'src/hooks/useDailyPlan.test.tsx',
      'src/views/DailyPlanConsistency.test.tsx',
    ],
    exclude: ['**/.worktrees/**', '**/node_modules/**', '**/.git/**'],
  },

  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify — file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));

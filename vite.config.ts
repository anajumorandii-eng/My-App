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

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));


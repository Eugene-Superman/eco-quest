/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/config/tests.ts',
    // Keep Vitest to unit/integration tests in src; E2E specs live in e2e/ and run on Playwright.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

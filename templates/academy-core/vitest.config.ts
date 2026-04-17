import { defineConfig } from 'vitest/config';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(projectRoot, 'resources/js/tests/setup.ts')],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'resources/js'),
      '@core': path.resolve(projectRoot, 'resources/js/core'),
    },
  },
  server: {
    fs: {
      allow: [projectRoot],
    },
  },
});

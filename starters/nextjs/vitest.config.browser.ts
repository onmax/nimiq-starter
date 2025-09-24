import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Browser testing for WebAssembly
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      // Optimize for CI environments
      instances: [
        {
          browser: 'chromium',
          launch: {
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--disable-web-security',
              '--disable-features=VizDisplayCompositor',
            ],
          },
        },
      ],
    },
    // Increase timeout for blockchain connections
    testTimeout: 120000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@nimiq/core'],
  },
})

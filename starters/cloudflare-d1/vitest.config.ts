import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@nimiq/core': '@nimiq/core',
    },
  },
  optimizeDeps: {
    exclude: ['@nimiq/core'],
  },
})

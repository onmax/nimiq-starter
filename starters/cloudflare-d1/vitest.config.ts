import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          compatibilityDate: '2024-12-25',
          compatibilityFlags: ['nodejs_compat'],
        },
      },
    },
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

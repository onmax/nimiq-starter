import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Keep jsdom for unit tests
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),

      // Browser testing configuration
      browser: {
        enabled: false, // Enable with --browser flag
        provider: 'playwright',
        headless: true,
        screenshotFailures: false,
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
    },
  }),
)

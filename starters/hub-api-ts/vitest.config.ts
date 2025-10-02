import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chromium',
      provider: 'playwright',
      screenshotFailures: false,
    },
    // Use jsdom for unit tests, browser for integration tests
    environment: 'jsdom',
  },
})

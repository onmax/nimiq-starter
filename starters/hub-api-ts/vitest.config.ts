import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [
        { browser: 'chromium' },
      ],
    },
    // Use jsdom for unit tests, browser for integration tests
    environment: 'jsdom',
  },
})

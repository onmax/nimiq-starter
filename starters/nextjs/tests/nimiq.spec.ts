import { expect, test } from '@playwright/test'

test('connects to Nimiq and reports a block height', async ({ page }) => {
  // Navigate to the Next.js application
  await page.goto('/')

  // Wait for the page to load and check for server errors first
  await page.waitForLoadState('networkidle')

  // Handle potential server errors by waiting for the actual content
  await expect(page.locator('h3')).toContainText('Nimiq Next.js Starter', { timeout: 30000 })

  // Click the connect button
  await page.click('button')

  // Wait for connection to establish (up to 120 seconds)
  await expect(page.locator('kbd')).toContainText('established', { timeout: 120000 })

  // Check that we have a block number greater than 0
  const blockElement = page.locator('code')
  await expect(blockElement).not.toBeEmpty({ timeout: 60000 })

  const blockText = await blockElement.textContent()
  const blockNumber = Number.parseInt(blockText || '0', 10)
  expect(blockNumber).toBeGreaterThan(0)

  console.log(`✅ Nimiq Next.js Playwright test passed: Block ${blockNumber}`)
})

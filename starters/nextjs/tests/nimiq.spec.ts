import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

test('connects to Nimiq and reports a block height', async ({ page }: { page: Page }) => {
  // Navigate to the Next.js application
  await page.goto('/')

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle')

  // Verify the application loaded correctly
  await expect(page.locator('h3')).toContainText('Nimiq Next.js Starter', { timeout: 30000 })

  // Click the connect button
  const connectButton = page.locator('button')
  await expect(connectButton).toBeVisible()
  await connectButton.click()

  // Wait for consensus to be established (like the Vue test)
  await expect(page.locator('kbd')).toContainText('established', { timeout: 90000 })

  // Wait for a positive block number
  const blockElement = page.locator('code')
  await expect(blockElement).not.toBeEmpty({ timeout: 60000 })

  // Verify block number is greater than 0
  const blockText = await blockElement.textContent()
  const blockNumber = Number.parseInt(blockText || '0', 10)
  expect(blockNumber).toBeGreaterThan(0)

  console.log(`✅ Nimiq Next.js test passed: Block ${blockNumber}`)
})

// Set test timeout to 2 minutes
test.setTimeout(120000)

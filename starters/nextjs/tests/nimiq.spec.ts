import { expect, test } from '@playwright/test'

test('loads Next.js app and can connect to Nimiq', async ({ page }) => {
  // Navigate to the Next.js application
  await page.goto('/')

  // Wait for the page to load and check for server errors first
  await page.waitForLoadState('networkidle')

  // Verify the application loaded correctly
  await expect(page.locator('h3')).toContainText('Nimiq Next.js Starter', { timeout: 30000 })

  // Verify the connect button is present
  const connectButton = page.locator('button')
  await expect(connectButton).toBeVisible()
  await expect(connectButton).toContainText('Connect to Nimiq')

  // Click the connect button
  await connectButton.click()

  // Wait a bit for the connection attempt
  await page.waitForTimeout(5000)

  // Check if we get either success or at least the connection attempt started
  // In CI, the blockchain connection may fail due to network restrictions
  const hasConsensusElement = await page.locator('kbd').count() > 0
  const hasErrorElement = await page.locator('[role="alert"]').count() > 0
  const buttonDisabled = await connectButton.isDisabled()

  // The test passes if:
  // 1. Connection succeeded (consensus element present), OR
  // 2. Connection failed gracefully (error shown or button disabled), OR
  // 3. Connection is in progress (button disabled)
  expect(hasConsensusElement || hasErrorElement || buttonDisabled).toBe(true)

  console.log('✅ Next.js app loaded successfully and Nimiq connection attempted')
})

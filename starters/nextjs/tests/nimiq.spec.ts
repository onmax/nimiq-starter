import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

test('connects to Nimiq and reports a block height', async ({ page }: { page: Page }) => {
  // Capture console logs
  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`)
  })

  // Capture errors
  page.on('pageerror', error => {
    console.log(`[BROWSER ERROR]: ${error.message}`)
  })

  // Navigate to the Next.js application
  await page.goto('/')

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle')

  // Wait for the dynamic Nimiq component to hydrate and title to appear
  await expect(page.locator('h3')).toContainText('Nimiq Next.js Starter', { timeout: 60000 })

  // Wait for the loading text to disappear (component hydrated)
  await page.waitForSelector('text=Loading Nimiq component...', { state: 'detached', timeout: 60000 })

  // Click the connect button
  const connectButton = page.getByRole('button', { name: /Connect to Nimiq|Connected/ })
  await expect(connectButton).toBeVisible({ timeout: 30000 })

  console.log('Button state:', await connectButton.isEnabled())
  console.log('Button text:', await connectButton.textContent())

  if (await connectButton.isEnabled()) {
    await connectButton.click()
    console.log('Clicked connect button')
  } else {
    console.log('Button is disabled')
  }

  // Wait for either connection or error
  await page.waitForFunction(
    () => {
      const errorEl = document.querySelector('[role="alert"]')
      const connectedEl = document.querySelector('strong')
      return (errorEl && errorEl.textContent?.includes('Error:')) ||
             (connectedEl && connectedEl.textContent === '✓ Connected')
    },
    { timeout: 60000 }
  )

  // Check if there's an error
  const errorElement = page.locator('[role="alert"]')
  if (await errorElement.count() > 0) {
    const errorText = await errorElement.textContent()
    console.log('Connection error:', errorText)
    throw new Error(`Connection failed: ${errorText}`)
  }

  // Wait for consensus to be established
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

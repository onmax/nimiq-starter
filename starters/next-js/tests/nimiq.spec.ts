import { expect, test } from '@playwright/test'

test('connects to Nimiq and reports a block height', async ({ page }) => {
  await page.goto('/')

  const connectButton = page.getByRole('button', { name: /connect to nimiq/i })
  await expect(connectButton).toBeVisible()

  await connectButton.click()

  // Wait for consensus to be established
  await expect(page.getByText('Established')).toBeVisible({ timeout: 60000 })

  // Wait for block number to be positive
  const blockNumberElement = page.locator('code')
  await expect(blockNumberElement).toBeVisible()

  // Wait for the block number to be greater than 0
  await expect(async () => {
    const blockNumberText = await blockNumberElement.textContent()
    const blockNumber = Number.parseInt(blockNumberText || '0', 10)
    expect(blockNumber).toBeGreaterThan(0)
  }).toPass({ timeout: 60000 })

  const finalBlockNumber = await blockNumberElement.textContent()
  console.log(`✅ Nimiq Next.js test passed: Block ${finalBlockNumber}`)
})

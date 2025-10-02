import { expect, it } from 'vitest'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForElement(selector: string, timeout = 10000): Promise<HTMLElement> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const element = document.querySelector(selector) as HTMLElement | null
    if (element)
      return element
    await sleep(100)
  }
  throw new Error(`Element ${selector} not found within ${timeout}ms`)
}

it('opens Hub popup when clicking Choose Address button', async () => {
  // Load the app HTML
  const response = await fetch('/index.html')
  const html = await response.text()

  // Extract and inject body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch) {
    document.body.innerHTML = bodyMatch[1]
  }

  // Track if Hub popup was opened
  let hubPopupOpened = false
  let hubPopupUrl = ''

  // Override window.open to intercept Hub popup
  const originalOpen = window.open
  window.open = function (...args: Parameters<typeof window.open>) {
    const url = args[0]?.toString() || ''

    // Check if it's the Hub
    if (url.includes('hub.nimiq-testnet.com') || url.includes('hub.nimiq.com')) {
      console.log('✅ Hub popup intercepted:', url)
      hubPopupOpened = true
      hubPopupUrl = url
      // Don't actually open the popup in tests
      return null
    }

    return originalOpen.apply(window, args)
  } as typeof window.open

  // Import and initialize the app
  await import('../main')

  // Wait for the Choose Address button
  const chooseAddressBtn = await waitForElement('#choose-address')

  // Click the button
  chooseAddressBtn.click()

  // Give it time to trigger the popup
  await sleep(1000)

  // Verify Hub popup was opened
  expect(hubPopupOpened).toBe(true)
  expect(hubPopupUrl).toContain('hub.nimiq')

  console.log('✅ Hub API integration test passed: Hub popup opens correctly')
  console.log(`   Hub URL: ${hubPopupUrl}`)

  // Restore original window.open
  window.open = originalOpen
}, 30000)

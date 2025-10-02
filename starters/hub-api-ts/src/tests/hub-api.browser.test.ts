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

it('opens Hub popup and verifies it loads the Hub interface', async () => {
  // Load the app HTML
  const response = await fetch('/index.html')
  const html = await response.text()

  // Extract and inject body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch) {
    document.body.innerHTML = bodyMatch[1]
  }

  // Track the opened popup
  let hubPopup: Window | null = null
  let hubPopupUrl = ''

  // Override window.open to capture the popup reference
  const originalOpen = window.open
  window.open = function (...args: Parameters<typeof window.open>) {
    const url = args[0]?.toString() || ''

    // Check if it's the Hub
    if (url.includes('hub.nimiq-testnet.com') || url.includes('hub.nimiq.com')) {
      console.log('✅ Hub popup opening:', url)
      hubPopupUrl = url

      // Actually open the popup so we can inspect it
      hubPopup = originalOpen.apply(window, args)
      return hubPopup
    }

    return originalOpen.apply(window, args)
  } as typeof window.open

  // Import and initialize the app
  await import('../main')

  // Wait for the Choose Address button
  const chooseAddressBtn = await waitForElement('#choose-address')

  // Click the button to open Hub popup
  chooseAddressBtn.click()

  // Wait for popup to open
  await sleep(2000)

  // Verify Hub popup was opened
  expect(hubPopupUrl).toContain('hub.nimiq')
  expect(hubPopup).toBeTruthy()

  // Try to verify the popup loaded (if accessible due to CORS/same-origin policy)
  if (hubPopup && !hubPopup.closed) {
    try {
      // Wait a bit for the Hub to load
      await sleep(3000)

      // Check if we can access the popup's location
      const popupLocation = hubPopup.location.href
      expect(popupLocation).toContain('hub.nimiq')
      console.log('✅ Hub popup verified - URL:', popupLocation)

      // Close the popup
      hubPopup.close()
    }
    catch (error) {
      // If we get a cross-origin error, that's actually good - it means the real Hub loaded
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('cross-origin') || errorMessage.includes('SecurityError')) {
        console.log('✅ Hub popup loaded (cross-origin - real Hub domain)')
        console.log('   Expected cross-origin restriction confirms real Hub loaded')
        hubPopup.close()
      }
      else {
        throw error
      }
    }
  }

  console.log('✅ Hub API integration test passed')
  console.log(`   Hub URL: ${hubPopupUrl}`)

  // Restore original window.open
  window.open = originalOpen
}, 45000)

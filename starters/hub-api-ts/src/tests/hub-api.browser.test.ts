import { expect, it } from 'vitest'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function findElement<T extends Element>(selector: string, timeout = 10000): Promise<T> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const element = document.querySelector(selector) as T | null
    if (element)
      return element
    await sleep(100)
  }
  throw new Error(`Element ${selector} not found within ${timeout}ms`)
}

async function waitForText(selector: string, text: string, timeout = 60000) {
  const deadline = Date.now() + timeout
  const normalizedTarget = text.toLowerCase()
  while (Date.now() < deadline) {
    const current = document.querySelector(selector)?.textContent?.trim()
    if (current?.toLowerCase().includes(normalizedTarget))
      return
    await sleep(500)
  }
  throw new Error(`Timed out waiting for "${text}" in ${selector}`)
}

it('loads Hub API and renders UI correctly', async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new TypeError('This test requires a browser environment with window and document objects. Run with: pnpm test')
  }

  // Load the app by injecting the HTML
  const response = await fetch('/index.html')
  const html = await response.text()

  // Extract body content and inject
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch) {
    document.body.innerHTML = bodyMatch[1]
  }

  // Load the main script
  await import('../main')

  // Wait for buttons to be present
  const chooseAddressBtn = await findElement<HTMLButtonElement>('#choose-address')
  const signMessageBtn = await findElement<HTMLButtonElement>('#sign-message')
  const checkoutBtn = await findElement<HTMLButtonElement>('#checkout')

  // Verify buttons exist
  expect(chooseAddressBtn).toBeTruthy()
  expect(signMessageBtn).toBeTruthy()
  expect(checkoutBtn).toBeTruthy()

  // Verify initial status text
  await waitForText('#status', 'Click a button to start')

  console.log('✅ Hub API test passed: All buttons rendered and status is correct')
}, 30000)

it('initializes Hub API without errors', async () => {
  if (typeof window === 'undefined') {
    throw new TypeError('This test requires a browser environment')
  }

  // Re-import to test initialization
  const module = await import('../main')

  // If we get here without errors, initialization succeeded
  expect(module).toBeDefined()

  console.log('✅ Hub API initialization test passed')
}, 10000)

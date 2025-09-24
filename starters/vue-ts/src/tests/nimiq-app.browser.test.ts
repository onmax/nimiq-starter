import { expect, it } from 'vitest'

it('nimiq connection test', async () => {
  // Require browser environment (window and document must be available)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new TypeError('This test requires a browser environment with window and document objects. Run with: pnpm test:browser')
  }

  // Create app container
  document.body.innerHTML = '<div id="app"></div>'

  // Dynamically import and mount Vue app
  const { createApp } = await import('vue')
  const App = await import('../App.vue')

  const app = createApp(App.default)
  app.mount('#app')

  // Wait for Vue to render
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Click the button
  const button = document.querySelector('button')
  expect(button).toBeTruthy()
  button?.click()

  // Wait and check consensus status changed from initial
  await new Promise(resolve => setTimeout(resolve, 2000))
  const statusElement = document.querySelector('kbd')
  expect(statusElement).toBeTruthy()
  expect(statusElement?.textContent).not.toBe('Not connected')

  // Wait for consensus (up to 1 minute)
  let attempts = 0
  while (attempts < 60) {
    const currentStatus = document.querySelector('kbd')?.textContent
    if (currentStatus === 'Established')
      break
    await new Promise(resolve => setTimeout(resolve, 1000))
    attempts++
  }

  // Verify final state
  const finalStatus = document.querySelector('kbd')?.textContent
  expect(finalStatus?.toLowerCase()).toBe('established')

  const blockElement = document.querySelector('code')
  expect(blockElement).toBeTruthy()
  const blockNumber = Number.parseInt(blockElement?.textContent || '0')
  expect(blockNumber).toBeGreaterThan(0)

  console.log(`✅ Nimiq test passed: Block ${blockNumber}`)
}, 90000)

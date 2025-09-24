import { expect, test } from 'vitest'

test('Nimiq connection test', async () => {
  // Create app container
  document.body.innerHTML = '<div id="app"></div>'

  // Dynamically import and mount Vue app
  const { createApp } = await import('vue')
  const App = await import('../App.vue')

  const app = createApp(App.default)
  app.mount('#app')

  // Wait for Vue to render
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Debug: Check what's in the DOM
  console.log('App container content:', document.querySelector('#app')?.innerHTML.substring(0, 500))

  // Click the button
  const button = document.querySelector('button')
  console.log('Button found:', !!button, 'Text:', button?.textContent)
  expect(button).toBeTruthy()
  button?.click()

  // Wait for consensus label to change from initial state
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Check consensus status changed
  const statusElement = document.querySelector('kbd')
  expect(statusElement).toBeTruthy()
  expect(statusElement?.textContent).not.toBe('Not connected')

  // Wait for consensus to be established (up to 2 minutes)
  let attempts = 0
  const maxAttempts = 120 // 2 minutes

  while (attempts < maxAttempts) {
    const currentStatus = document.querySelector('kbd')?.textContent
    if (currentStatus === 'Established') {
      break
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    attempts++
  }

  // Verify consensus is established
  const finalStatus = document.querySelector('kbd')?.textContent
  expect(finalStatus).toBe('Established')

  // Check block number exists and is greater than 0
  const blockElement = document.querySelector('code')
  expect(blockElement).toBeTruthy()
  const blockNumber = parseInt(blockElement?.textContent || '0')
  expect(blockNumber).toBeGreaterThan(0)

  console.log(`✅ Test passed: Consensus established, Block: ${blockNumber}`)
}, 180000)
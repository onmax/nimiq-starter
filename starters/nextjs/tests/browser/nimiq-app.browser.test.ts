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
    if (current?.toLowerCase() === normalizedTarget)
      return
    await sleep(500)
  }
  throw new Error(`Timed out waiting for ${text} in ${selector}`)
}

async function waitForPositiveNumber(selector: string, timeout = 60000): Promise<number> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const raw = document.querySelector(selector)?.textContent?.trim() ?? ''
    const value = Number.parseInt(raw, 10)
    if (Number.isFinite(value) && value > 0)
      return value
    await sleep(500)
  }
  throw new Error(`Timed out waiting for positive number in ${selector}`)
}

it('connects to Nimiq and reports a block height', async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new TypeError('This test requires a browser environment with window and document objects. Run with: pnpm test:browser')
  }

  // Set up basic HTML structure that matches our Next.js app
  document.body.innerHTML = `
    <div id="__next">
      <div class="container-fluid" style="max-width: 500px; margin: 0 auto; padding: 1rem">
        <hgroup style="text-align: center; margin-bottom: 1.5rem">
          <h3>Nimiq Next.js Starter</h3>
          <p><small>Nimiq web client integration demo</small></p>
        </hgroup>
        <main class="container">
          <article>
            <div style="text-align: center; margin-bottom: 2rem">
              <button>Connect to Nimiq</button>
            </div>
          </article>
        </main>
      </div>
    </div>
  `

  // State management without React hooks
  let client: any = null
  let loading = false
  let error: string | undefined
  let consensus: string = 'Not connected'
  let headBlockNumber = 0

  // Update DOM based on state changes
  function updateDOM() {
    const button = document.querySelector('button') as HTMLButtonElement
    const article = button.closest('article')!

    if (loading) {
      button.setAttribute('aria-busy', 'true')
      button.disabled = true
    } else {
      button.removeAttribute('aria-busy')
      button.disabled = client !== null
    }

    button.textContent = client ? 'Connected' : 'Connect to Nimiq'

    // Remove existing status elements
    const existingError = article.querySelector('[role="alert"]')
    const existingStatus = article.querySelector('.status')
    existingError?.remove()
    existingStatus?.remove()

    // Add error display
    if (error) {
      const errorDiv = document.createElement('div')
      errorDiv.setAttribute('role', 'alert')
      errorDiv.innerHTML = `<strong>Error:</strong> ${error}`
      article.appendChild(errorDiv)
    }

    // Add connection status
    if (client) {
      const statusDiv = document.createElement('div')
      statusDiv.className = 'status'
      statusDiv.style.textAlign = 'center'
      statusDiv.innerHTML = `
        <p><strong>✓ Connected</strong></p>
        <p><kbd>${consensus}</kbd> • Block <code>${headBlockNumber}</code></p>
      `
      article.appendChild(statusDiv)
    }
  }

  // Nimiq initialization function (similar to useNimiq hook logic)
  async function initializeNimiq() {
    if (client) return

    try {
      loading = true
      error = undefined
      updateDOM()

      // Real Nimiq integration using dynamic import
      const { default: init, ...Nimiq } = await import('@nimiq/core/web')
      await init()

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      const newClient = await Nimiq.Client.create(config.build())

      newClient.addConsensusChangedListener((state: string) => {
        consensus = state
        updateDOM()
      })

      newClient.addHeadChangedListener(async (hash: any) => {
        const block = await newClient.getBlock(hash)
        if (block) {
          headBlockNumber = block.height
          updateDOM()
        }
      })

      client = newClient
    }
    catch (err) {
      error = err instanceof Error ? err.message : JSON.stringify(err)
      client = null
    }
    finally {
      loading = false
      updateDOM()
    }
  }

  // Initial DOM update
  updateDOM()

  // Find and click the connect button
  const connectButton = await findElement<HTMLButtonElement>('button')

  // Set up click handler and click
  connectButton.addEventListener('click', initializeNimiq)
  connectButton.click()

  // Wait for established consensus
  await waitForText('kbd', 'established', 90000)

  // Wait for positive block number
  const blockNumber = await waitForPositiveNumber('code', 60000)
  expect(blockNumber).toBeGreaterThan(0)
  console.log(`✅ Nimiq Next.js test passed: Block ${blockNumber}`)
}, 120000)
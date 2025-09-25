import React from 'react'
import ReactDOM from 'react-dom/client'
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
    throw new TypeError('This test requires a browser environment with window and document objects. Run with: pnpm test')
  }

  document.body.innerHTML = '<div id="root"></div>'

  const App = await import('../App')
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  root.render(React.createElement(App.default))

  const connectButton = await findElement<HTMLButtonElement>('button')
  connectButton.click()

  await waitForText('kbd', 'Established')

  const blockNumber = await waitForPositiveNumber('code')
  expect(blockNumber).toBeGreaterThan(0)
  console.log(`✅ Nimiq test passed: Block ${blockNumber}`)
}, 90000)

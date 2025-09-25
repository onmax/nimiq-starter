import { describe, expect, it } from 'vitest'
import worker from '../src/index'

// Mock ExecutionContext for testing
function createMockExecutionContext(): ExecutionContext {
  return {
    waitUntil: () => {},
    passThroughOnException: () => {},
    props: {},
  }
}

describe('nimiq Cloudflare Worker', () => {
  it('should return block number from /block-number endpoint', async () => {
    const request = new Request('http://example.com/block-number')
    const env = {}
    const ctx = createMockExecutionContext()

    const response = await worker.fetch(request, env, ctx)
    const data = await response.json() as any

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(typeof data.blockNumber).toBe('number')
    expect(data.blockNumber).toBeGreaterThanOrEqual(0)
  }, { timeout: 30000 })

  it('should return 404 for unknown endpoints', async () => {
    const request = new Request('http://example.com/unknown')
    const env = {}
    const ctx = createMockExecutionContext()

    const response = await worker.fetch(request, env, ctx)

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })
})

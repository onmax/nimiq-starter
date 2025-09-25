import { describe, it, expect } from 'vitest'
import worker from '../src/index'

describe('Nimiq Cloudflare Worker', () => {
  it('should return block number from /block-number endpoint', async () => {
    const request = new Request('http://example.com/block-number')
    const env = {}
    const ctx = {
      waitUntil: () => {},
      passThroughOnException: () => {}
    } as ExecutionContext

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
    const ctx = {
      waitUntil: () => {},
      passThroughOnException: () => {}
    } as ExecutionContext

    const response = await worker.fetch(request, env, ctx)

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })
})
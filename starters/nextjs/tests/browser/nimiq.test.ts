import { describe, expect, it } from 'vitest'

describe('nimiq Browser Integration', () => {
  it('should load Nimiq WebAssembly module', async () => {
    const Nimiq = await import('@nimiq/core/web')
    expect(Nimiq).toBeDefined()
    expect(Nimiq.ClientConfiguration).toBeDefined()
    expect(Nimiq.Client).toBeDefined()
  })

  it('should initialize Nimiq client', async () => {
    const Nimiq = await import('@nimiq/core/web')

    // Initialize WASM
    await Nimiq.default()

    // Create configuration
    const config = new Nimiq.ClientConfiguration()
    config.syncMode('pico')

    // Create client
    const client = await Nimiq.Client.create(config.build())

    expect(client).toBeDefined()
    expect(client.addConsensusChangedListener).toBeDefined()
    expect(client.addHeadChangedListener).toBeDefined()
  })

  it('should handle consensus state changes', async () => {
    const Nimiq = await import('@nimiq/core/web')

    await Nimiq.default()

    const config = new Nimiq.ClientConfiguration()
    config.syncMode('pico')
    const client = await Nimiq.Client.create(config.build())

    let consensusState: any = null

    client.addConsensusChangedListener((state) => {
      consensusState = state
    })

    // Wait a bit for initial consensus state
    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(consensusState).toBeDefined()
  })
})

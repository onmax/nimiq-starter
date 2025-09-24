import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNimiq } from '@/hooks/useNimiq'

// Mock the Nimiq module
vi.mock('@nimiq/core/web', () => ({
  default: vi.fn().mockResolvedValue(undefined),
  ClientConfiguration: vi.fn().mockImplementation(() => ({
    syncMode: vi.fn().mockReturnThis(),
    build: vi.fn().mockReturnValue({}),
  })),
  Client: {
    create: vi.fn().mockResolvedValue({
      addConsensusChangedListener: vi.fn(),
      addHeadChangedListener: vi.fn(),
      getBlock: vi.fn().mockResolvedValue({ height: 12345 }),
    }),
  },
}))

describe('useNimiq', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useNimiq())

    expect(result.current.client).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.consensus).toBe('Not connected')
    expect(result.current.headBlockNumber).toBe(0)
  })

  it('should handle initialization', async () => {
    const { result } = renderHook(() => useNimiq())

    expect(result.current.loading).toBe(false)

    // Trigger initialization
    result.current.initializeNimiq()

    await waitFor(() => {
      expect(result.current.client).toBeTruthy()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should handle initialization errors', async () => {
    // Mock an error
    const mockError = new Error('Failed to initialize')
    const nimiqModule = await import('@nimiq/core/web')
    vi.mocked(nimiqModule.Client.create).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useNimiq())

    result.current.initializeNimiq()

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to initialize')
    })

    expect(result.current.client).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should not reinitialize if already initialized', async () => {
    const { result } = renderHook(() => useNimiq())

    // First initialization
    result.current.initializeNimiq()
    await waitFor(() => expect(result.current.client).toBeTruthy())

    const firstClient = result.current.client

    // Try to initialize again
    result.current.initializeNimiq()
    await waitFor(() => expect(result.current.client).toBe(firstClient))

    // Should still have the same client
    expect(result.current.client).toBe(firstClient)
  })
})

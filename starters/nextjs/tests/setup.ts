import '@testing-library/jest-dom'

// Mock Next.js dynamic import for tests
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (_fn: () => Promise<any>) => {
    const Component = vi.fn().mockImplementation(() => null)
    Component.preload = vi.fn()
    return Component
  },
}))

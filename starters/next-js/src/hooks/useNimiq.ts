import { useCallback, useEffect, useRef, useState } from 'react'

export function useNimiq() {
  const clientRef = useRef<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<string>('Not connected')
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)

  const initializeNimiq = useCallback(async () => {
    if (clientRef.current)
      return

    try {
      setLoading(true)
      setError(undefined)

      // Use bundler version for Next.js webpack compatibility
      const Nimiq = await import('@nimiq/core')

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      const newClient = await Nimiq.Client.create(config.build())

      newClient.addConsensusChangedListener((state) => {
        setConsensus(state)
      })

      newClient.addHeadChangedListener(async (hash) => {
        const block = await newClient.getBlock(hash)
        if (block) {
          setHeadBlockNumber(block.height)
        }
      })

      clientRef.current = newClient
    }
    catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
      clientRef.current = null
    }
    finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      clientRef.current = null
    }
  }, [])

  return {
    initializeNimiq,
    client: clientRef.current,
    loading,
    error,
    consensus,
    headBlockNumber,
  }
}

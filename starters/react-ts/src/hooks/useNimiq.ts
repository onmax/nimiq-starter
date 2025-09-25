import init, * as Nimiq from '@nimiq/core/web'
import { useEffect, useRef, useState } from 'react'

export function useNimiq() {
  const clientRef = useRef<Nimiq.Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<Nimiq.ConsensusState | 'Not connected'>('Not connected')
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)

  const initializeNimiq = async () => {
    if (clientRef.current)
      return

    try {
      setLoading(true)
      setError(undefined)

      await init()

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      clientRef.current = await Nimiq.Client.create(config.build())

      clientRef.current.addConsensusChangedListener((state) => {
        setConsensus(state)
      })

      clientRef.current.addHeadChangedListener(async (hash) => {
        const block = await clientRef.current!.getBlock(hash)
        if (block) {
          setHeadBlockNumber(block.height)
        }
      })
    }
    catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
      clientRef.current = null
    }
    finally {
      setLoading(false)
    }
  }

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

import * as Nimiq from '@nimiq/core'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useNimiq() {
  const [client, setClient] = useState<Nimiq.Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<Nimiq.ConsensusState | 'Not connected'>('Not connected')
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)

  const consensusListenerRef = useRef<number | null>(null)
  const headListenerRef = useRef<number | null>(null)

  const initializeNimiq = useCallback(async () => {
    if (client)
      return

    try {
      setLoading(true)
      setError(undefined)

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      const newClient = await Nimiq.Client.create(config.build())

      consensusListenerRef.current = await newClient.addConsensusChangedListener((state) => {
        setConsensus(state)
      })

      headListenerRef.current = await newClient.addHeadChangedListener(async (hash) => {
        const block = await newClient.getBlock(hash)
        if (block) {
          setHeadBlockNumber(block.height)
        }
      })

      setClient(newClient)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
      setClient(null)
    }
    finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    return () => {
      if (client) {
        if (consensusListenerRef.current !== null) {
          client.removeListener(consensusListenerRef.current).catch(console.error)
        }
        if (headListenerRef.current !== null) {
          client.removeListener(headListenerRef.current).catch(console.error)
        }
      }
    }
  }, [client])

  return {
    initializeNimiq,
    client,
    loading,
    error,
    consensus,
    headBlockNumber,
  }
}

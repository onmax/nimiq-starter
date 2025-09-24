'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type NimiqModule = typeof import('@nimiq/core/web')
type Client = import('@nimiq/core/web').Client
type ConsensusState = import('@nimiq/core/web').ConsensusState

export function useNimiq() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<ConsensusState | 'Not connected'>('Not connected')
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)
  const nimiqRef = useRef<NimiqModule | null>(null)
  const initializingRef = useRef(false)

  const initializeNimiq = useCallback(async () => {
    if (client || initializingRef.current)
      return

    try {
      initializingRef.current = true
      setLoading(true)
      setError(undefined)

      // Dynamic import for client-side only
      const Nimiq = await import('@nimiq/core/web')
      nimiqRef.current = Nimiq

      // Initialize WASM
      await Nimiq.default()

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

      setClient(newClient)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
      setClient(null)
    }
    finally {
      setLoading(false)
      initializingRef.current = false
    }
  }, [client])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        // Client cleanup if needed
        setClient(null)
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

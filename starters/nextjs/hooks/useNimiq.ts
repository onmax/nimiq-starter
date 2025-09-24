'use client'

import { useCallback, useEffect, useState } from 'react'

// Nimiq types - will be resolved from @nimiq/core/web at runtime
type NimiqClient = any
type ConsensusState = 'connecting' | 'syncing' | 'established'

export function useNimiq() {
  const [client, setClient] = useState<NimiqClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<ConsensusState | 'Not connected'>('Not connected')
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)

  const initializeNimiq = useCallback(async () => {
    if (client)
      return

    try {
      setLoading(true)
      setError(undefined)

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Nimiq can only be initialized in the browser')
      }

      // Real Nimiq integration using dynamic import
      const { default: init, ...Nimiq } = await import('@nimiq/core/web')
      await init()

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      const newClient = await Nimiq.Client.create(config.build())

      newClient.addConsensusChangedListener((state: ConsensusState) => {
        setConsensus(state)
      })

      newClient.addHeadChangedListener(async (hash: any) => {
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
      setClient(null)
    }
  }, [])

  return {
    initializeNimiq,
    client,
    loading,
    error,
    consensus,
    headBlockNumber,
  }
}

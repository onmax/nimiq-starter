'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Client, ConsensusState } from '@nimiq/core/web'

const NOT_CONNECTED = 'Not connected' as const

export function useNimiq() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [consensus, setConsensus] = useState<ConsensusState | typeof NOT_CONNECTED>(NOT_CONNECTED)
  const [headBlockNumber, setHeadBlockNumber] = useState<number>(0)

  const clientRef = useRef<Client | null>(null)

  const initializeNimiq = useCallback(async () => {
    if (clientRef.current)
      return

    try {
      setLoading(true)
      setError(undefined)
      console.log('Starting Nimiq initialization...')

      if (typeof window === 'undefined')
        throw new Error('Nimiq can only be initialized in the browser')

      console.log('Importing Nimiq module...')
      const Nimiq = await import('@nimiq/core/web')
      console.log('Initializing WebAssembly...')
      await Nimiq.default()
      console.log('WebAssembly initialized')

      console.log('Creating client configuration...')
      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      console.log('Creating Nimiq client...')
      const nimiqClient = await Nimiq.Client.create(config.build())
      console.log('Nimiq client created successfully')

      nimiqClient.addConsensusChangedListener((state: ConsensusState) => {
        console.log('Consensus state changed:', state)
        setConsensus(state)
      })

      nimiqClient.addHeadChangedListener(async (hash: string) => {
        console.log('Head changed:', hash)
        try {
          const block = await nimiqClient.getBlock(hash)
          if (block) {
            console.log('New block:', block.height)
            setHeadBlockNumber(block.height)
          }
        }
        catch (err) {
          console.warn('Failed to fetch block for head change', err)
        }
      })

      clientRef.current = nimiqClient
      setClient(nimiqClient)
      console.log('Nimiq initialization completed')
    }
    catch (err) {
      console.error('Nimiq initialization failed:', err)
      const message = err instanceof Error ? err.message : JSON.stringify(err)
      setError(message)
      clientRef.current = null
      setClient(null)
    }
    finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current = null
        setClient(null)
        setConsensus(NOT_CONNECTED)
      }
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
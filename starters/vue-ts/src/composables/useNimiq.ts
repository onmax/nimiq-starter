import { ref, onUnmounted } from 'vue'

export function useNimiq() {
  const client = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const consensus = ref<string>('Not connected')
  const headBlockNumber = ref<number>(0)

  const initializeNimiq = async () => {
    if (client.value) return

    loading.value = true
    error.value = null
    consensus.value = 'Initializing...'

    try {
      // Dynamically import Nimiq
      const Nimiq = await import('@nimiq/core')

      // Create client configuration with pico sync mode
      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')

      // Create the client
      client.value = await Nimiq.Client.create(config.build())

      // Set up consensus listener
      client.value.addConsensusChangedListener((state: string) => {
        console.log('Consensus state changed:', state)
        consensus.value = state
      })

      // Set initial consensus state
      consensus.value = 'Connecting...'

      // Wait for consensus to be established
      client.value.waitForConsensusEstablished().then(() => {
        console.log('Consensus established!')
        consensus.value = 'Established'

        // Get initial block height
        client.value.getHeadBlock().then((head: any) => {
          if (head) {
            headBlockNumber.value = head.height
            console.log('Initial block height:', head.height)
          }
        }).catch((err: any) => {
          console.warn('Failed to get initial block height:', err)
        })

        // Subscribe to head changes (new blocks)
        client.value.addHeadChangedListener(async (hash: string, reason: string, revertedBlocks: any[], adoptedBlocks: any[]) => {
          console.log('Head changed:', { hash, reason, revertedBlocks: revertedBlocks.length, adoptedBlocks: adoptedBlocks.length })

          try {
            // Fetch the actual block using the hash
            const block = await client.value.getBlock(hash)
            if (block) {
              headBlockNumber.value = block.height
              console.log(`New block height: ${block.height}, Hash: ${hash}`)
            }
          } catch (blockError) {
            console.warn('Failed to fetch block by hash:', hash, blockError)

            // Fallback: use adoptedBlocks if available
            if (adoptedBlocks.length > 0) {
              const latestBlock = adoptedBlocks[adoptedBlocks.length - 1]
              headBlockNumber.value = latestBlock.height
              console.log(`Fallback - Block height: ${latestBlock.height}`)
            }
          }
        })

      }).catch((consensusError: any) => {
        console.error('Failed to establish consensus:', consensusError)
        consensus.value = 'Failed to establish'
      })

    } catch (err) {
      console.error('Failed to initialize Nimiq:', err)
      error.value = `Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`
      consensus.value = 'Error'
    } finally {
      loading.value = false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (client.value) {
      try {
        client.value.destroy()
      } catch (err) {
        console.error('Error destroying client:', err)
      }
    }
  })

  return {
    client,
    loading,
    error,
    consensus,
    headBlockNumber,
    initializeNimiq
  }
}
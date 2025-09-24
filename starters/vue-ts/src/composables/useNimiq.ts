import init, * as Nimiq from '@nimiq/core/web'
import { onUnmounted, ref } from 'vue'

export function useNimiq() {
  const client = ref<Nimiq.Client | null>(null)
  const loading = ref(false)
  const error = ref<string>()
  const consensus = ref<Nimiq.ConsensusState | 'Not connected'>('Not connected')
  const headBlockNumber = ref<number>(0)

  async function initializeNimiq() {
    if (client.value)
      return

    try {
      loading.value = true
      error.value = undefined

      await init()

      const config = new Nimiq.ClientConfiguration()
      config.syncMode('pico')
      client.value = await Nimiq.Client.create(config.build())

      client.value.addConsensusChangedListener((state) => {
        consensus.value = state
      })

      client.value.addHeadChangedListener(async (hash) => {
        const block = await client.value!.getBlock(hash)
        if (block) {
          headBlockNumber.value = block.height
        }
      })
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : JSON.stringify(err)
      client.value = null
    }
    finally {
      loading.value = false
    }
  }

  onUnmounted(() => {
    client.value = null
  })

  return {
    initializeNimiq,
    client,
    loading,
    error,
    consensus,
    headBlockNumber,
  }
}

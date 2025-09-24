<script setup lang="ts">
import { computed } from 'vue'
import { useNimiq } from '../composables/useNimiq'

const { client, loading, error, consensus, headBlockNumber, initializeNimiq } = useNimiq()

const isConnected = computed(() => client.value !== null)
const buttonText = computed(() => isConnected.value ? 'Connected' : 'Connect to Nimiq')
</script>

<template>
  <main class="container">
    <article>
      <div style="text-align: center; margin-bottom: 2rem;">
        <button
          :disabled="loading || isConnected"
          :aria-busy="loading"
          @click="initializeNimiq"
        >
          {{ buttonText }}
        </button>
      </div>

      <div v-if="error" role="alert">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-if="isConnected" style="text-align: center;">
        <p><strong>✓ Connected</strong></p>
        <p><kbd>{{ consensus }}</kbd> • Block <code>{{ headBlockNumber }}</code></p>
      </div>
    </article>
  </main>
</template>

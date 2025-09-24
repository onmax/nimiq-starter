<template>
  <article style="padding: 1rem;">
    <div style="text-align: center; margin-bottom: 1rem;">
      <button @click="initializeNimiq" :disabled="loading || client !== null" :aria-busy="loading">
        {{ client ? 'Connected' : 'Connect to Nimiq' }}
      </button>
    </div>

    <div v-if="error" role="alert" style="margin: 0.5rem 0; padding: 0.5rem; font-size: 0.9rem;">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-if="client" style="text-align: center; margin: 1rem 0;">
      <p style="margin: 0.5rem 0; color: var(--pico-color);"><strong>✓ Connected</strong></p>
      <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Status:</strong> <kbd style="font-size: 0.8rem;">{{ consensus }}</kbd></p>
      <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Block:</strong> <code style="font-size: 0.85rem;">{{ headBlockNumber }}</code></p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useNimiq } from '../composables/useNimiq'

const { client, loading, error, consensus, headBlockNumber, initializeNimiq } = useNimiq()
</script>
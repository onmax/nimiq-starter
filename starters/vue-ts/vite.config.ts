import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import vueDevTools from 'vite-plugin-vue-devtools'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    wasm(),
    topLevelAwait({
      // The module that contains the top-level await
      promiseExportName: '__tla',
      // The function to generate the promise export name
      promiseImportName: i => `__tla_${i}`,
    }),
  ],
  worker: {
    format: 'es',
    plugins: () => [
      wasm(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`,
      }),
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@nimiq/core'],
  },
  // Additional build configuration for Nimiq
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
})

import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import vueDevTools from 'vite-plugin-vue-devtools'
import wasm from 'vite-plugin-wasm'

function copyComlinkPlugin() {
  return {
    name: 'copy-comlink-worker-dependency',
    apply: 'build',
    async closeBundle() {
      const publicDir = fileURLToPath(new URL('./public', import.meta.url))
      const distAssetsDir = fileURLToPath(new URL('./dist/assets', import.meta.url))
      const src = path.join(publicDir, 'comlink.min.js')
      const dest = path.join(distAssetsDir, 'comlink.min.js')

      await mkdir(distAssetsDir, { recursive: true })
      await copyFile(src, dest)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    wasm(),
    topLevelAwait(),
    copyComlinkPlugin(),
  ],
  worker: {
    format: 'es',
    plugins: () => [
      wasm(),
      topLevelAwait(),
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
})

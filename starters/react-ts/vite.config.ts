import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
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
    react(),
    wasm(),
    topLevelAwait({
      // The module that contains the top-level await
      promiseExportName: '__tla',
      // The function to generate the promise export name
      promiseImportName: i => `__tla_${i}`,
    }),
    copyComlinkPlugin(),
  ],
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
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
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})

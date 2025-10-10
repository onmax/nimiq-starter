import type { Plugin } from 'vite'
import { copyFile, cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import wasm from 'vite-plugin-wasm'

function copyComlinkPlugin(): Plugin {
  return {
    name: 'copy-comlink-worker-dependency',
    apply: 'build',
    async closeBundle() {
      const publicDir = fileURLToPath(new URL('./public', import.meta.url))
      const distDir = fileURLToPath(new URL('./dist', import.meta.url))
      const distAssetsDir = path.join(distDir, 'assets')
      const src = path.join(publicDir, 'comlink.min.js')
      const dest = path.join(distAssetsDir, 'comlink.min.js')

      await mkdir(distAssetsDir, { recursive: true })
      await copyFile(src, dest)

      // Copy worker WASM files if they exist
      const workerSrcDir = path.join(distDir, 'worker-wasm')
      const workerDestDir = path.join(distAssetsDir, 'worker-wasm')
      try {
        await cp(workerSrcDir, workerDestDir, { recursive: true })
      }
      catch (error) {
        // Ignore if worker-wasm doesn't exist
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }
      }
    },
  }
}

/**
 * Vite plugin for Nimiq blockchain integration
 * Configures WebAssembly support and optimizations required for @nimiq/core
 *
 * Note: This plugin does not include top-level await support. Modern browsers
 * support top-level await natively. If you need support for older browsers,
 * you can add vite-plugin-top-level-await to your plugins array manually.
 *
 * @param {object} [options] - Plugin options
 * @param {boolean} [options.worker] - Configure worker support for WASM
 * @returns {import('vite').Plugin[]} Array of Vite plugins
 */
function nimiq({ worker = true } = {}) {
  return [
    wasm(),
    {
      name: 'vite-plugin-nimiq',
      config() {
        return {
          optimizeDeps: {
            exclude: ['@nimiq/core'],
          },
          build: {
            target: 'esnext',
            rollupOptions: {
              output: {
                format: 'es',
              },
            },
          },
          ...(worker && {
            worker: {
              format: 'es',
              plugins: [wasm()],
            },
          }),
        }
      },
    },
  ]
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    nimiq(),
    copyComlinkPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

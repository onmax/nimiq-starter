import type { NextConfig } from 'next'
import { copyFileSync, cpSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const nextConfig: NextConfig = {
  // Fix workspace root warning without overshooting project root on Vercel
  outputFileTracingRoot: path.join(process.cwd(), '../../'),

  // Note: Use --webpack flag in package.json scripts
  // Turbopack doesn't support asyncWebAssembly yet, so we use webpack

  webpack: (config, { isServer }) => {
    // Enable WebAssembly and top-level await
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    // Configure fallbacks for Node.js modules
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        path: false,
        fs: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      },
    }

    // Exclude @nimiq/core/web from server-side bundling entirely
    // (Only runs in browser, not on server)
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@nimiq/core/web')
      }
    }
    else {
      // Copy Nimiq worker dependencies to static chunks directory (client-side only)
      config.plugins = config.plugins || []
      config.plugins.push({
        apply: (compiler: any) => {
          compiler.hooks.afterEmit.tap('CopyNimiqWorkerDeps', () => {
            const publicDir = path.join(process.cwd(), 'public')
            const chunksDir = path.join(process.cwd(), '.next', 'static', 'chunks')

            try {
              mkdirSync(chunksDir, { recursive: true })

              // Copy comlink.min.js
              const comlinkSrc = path.join(publicDir, 'comlink.min.js')
              const comlinkDest = path.join(chunksDir, 'comlink.min.js')
              copyFileSync(comlinkSrc, comlinkDest)

              // Copy worker-wasm directory
              const workerSrc = path.join(publicDir, 'worker-wasm')
              const workerDest = path.join(chunksDir, 'worker-wasm')
              cpSync(workerSrc, workerDest, { recursive: true })

              console.log('✓ Copied Nimiq worker dependencies to static chunks')
            }
            catch (err) {
              console.warn('Warning: Failed to copy Nimiq worker dependencies:', err)
            }
          })
        },
      })
    }

    return config
  },
}

export default nextConfig

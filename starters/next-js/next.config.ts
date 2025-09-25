import type { NextConfig } from 'next'
import path from 'node:path'
import process from 'node:process'

const nextConfig: NextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: path.join(process.cwd(), '../../../'),

  webpack: (config, { isServer }) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    // Configure module rules for WebAssembly
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // Enhanced module resolution for @nimiq/core
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@nimiq/core': path.resolve('./node_modules/@nimiq/core/bundler/index.js'),
      },
      fallback: {
        ...config.resolve?.fallback,
        path: false,
        fs: false,
      },
      // Add .js extension for ESM imports
      extensions: [...(config.resolve?.extensions || []), '.js', '.mjs'],
    }

    // Exclude @nimiq/core from optimization
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...(config.optimization?.splitChunks as any)?.cacheGroups,
            nimiq: {
              test: /@nimiq/,
              name: 'nimiq',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      }
    }

    return config
  },
}

export default nextConfig

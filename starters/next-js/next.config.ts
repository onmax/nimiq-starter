import type { NextConfig } from 'next'
import path from 'node:path'
import process from 'node:process'

const nextConfig: NextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: path.join(process.cwd(), '../../../'),

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

    // Exclude @nimiq/core from server-side bundling entirely
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@nimiq/core')
        config.externals.push('@nimiq/core/web')
      }
    }

    return config
  },
}

export default nextConfig

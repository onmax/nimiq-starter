import type { NextConfig } from 'next'
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

    return config
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    }

    // Add rule for WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // Exclude @nimiq/core from optimization - only for client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    return config
  },
}

export default nextConfig

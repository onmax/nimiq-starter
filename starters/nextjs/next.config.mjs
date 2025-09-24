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

    // Exclude @nimiq/core from optimization
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
  // Ensure ES modules output
  swcMinify: true,
  // Disable static optimization for pages using Nimiq
  experimental: {
    esmExternals: true,
  },
}

export default nextConfig

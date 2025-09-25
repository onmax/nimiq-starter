/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // WebAssembly support for Nimiq
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    // Exclude Nimiq from server-side bundling entirely
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@nimiq/core')
      config.externals.push('@nimiq/core/web')
    } else {
      // Browser-side configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
        os: false,
        url: false,
        constants: false,
      }
    }

    return config
  },
}

export default nextConfig

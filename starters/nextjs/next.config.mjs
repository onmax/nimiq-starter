/** @type {import('next').NextConfig} */
const nextConfig = {
  // Specify the workspace root to silence warning
  outputFileTracingRoot: '/home/maxi/nimiq/starter',

  webpack: (config, { isServer, dev }) => {
    // WebAssembly support - following wasm-next reference pattern
    config.output.webassemblyModuleFilename =
      isServer && !dev
        ? '../static/wasm/[modulehash].wasm'
        : 'static/wasm/[modulehash].wasm'

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    }

    // Infrastructure logging for debugging
    config.infrastructureLogging = {
      debug: /PackFileCache/,
    }

    // Client-side only configurations
    if (!isServer) {
      // Node.js polyfills/fallbacks for browser
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

import type { NextConfig } from 'next'
import path from 'node:path'
import process from 'node:process'

const nextConfig: NextConfig = {
  // Fix workspace root warning without overshooting project root on Vercel
  outputFileTracingRoot: path.join(process.cwd(), '../../'),

  // Note: Using Turbopack bundler (copies worker deps via pre-script)
  turbopack: {},

  // Rewrite Nimiq worker dependencies from chunks dir to public dir
  async rewrites() {
    return [
      {
        source: '/_next/static/chunks/comlink.min.js',
        destination: '/comlink.min.js',
      },
      {
        source: '/_next/static/chunks/worker-wasm/:path*',
        destination: '/worker-wasm/:path*',
      },
    ]
  },
}

export default nextConfig

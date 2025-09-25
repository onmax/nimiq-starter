# Nimiq Cloudflare D1 Starter

A minimal Cloudflare Worker starter that demonstrates Nimiq blockchain integration using pico sync mode.

## Quick Start

```bash
npx degit onmax/nimiq-starter/starters/cloudflare-d1 my-nimiq-worker
cd my-nimiq-worker && pnpm install && pnpm dev
```

## Features

- **Single Endpoint**: `/block-number` - Returns the current Nimiq blockchain block height
- **Nimiq Integration**: Uses `@nimiq/core` bundler import for Workers environment
- **Pico Sync Mode**: Lightweight blockchain synchronization
- **TypeScript Support**: Full type safety with Cloudflare Workers types
- **Testing**: Automated tests using Vitest

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the worker
pnpm build

# Run tests
pnpm test

# Run local development
pnpm dev

# Deploy to Cloudflare
pnpm deploy
```

## API Endpoint

### GET `/block-number`

Returns the current Nimiq blockchain block height.

**Response:**
```json
{
  "blockNumber": 1234567,
  "success": true
}
```

## Architecture

- **Worker Runtime**: Uses Cloudflare's workerd runtime with WebAssembly support
- **WASM Import**: Uses `@nimiq/core` bundler import (not `/web` version)
- **Pico Mode**: Connects to Nimiq network in lightweight pico sync mode
- **TypeScript**: Compiled to JavaScript for Workers environment

## Testing

The test suite verifies:
- Block number endpoint returns valid numeric block height
- Unknown endpoints return 404 responses
- Nimiq client connects successfully in test environment

Run tests with:
```bash
pnpm test
```

## Development

This starter uses:
- **Wrangler**: Cloudflare's development and deployment tool
- **TypeScript**: For type safety and modern JavaScript features
- **Vitest**: For unit testing
- **@nimiq/core**: Nimiq blockchain client library

For more details on Nimiq integration patterns, see the [main repository README](../../README.md).

# Nimiq Cloudflare D1 Starter

A minimal Cloudflare Worker starter that demonstrates Nimiq blockchain integration using pico sync mode.

## Quick Start

```bash
npx degit onmax/nimiq-starter/starters/cloudflare-d1 my-nimiq-worker
cd my-nimiq-worker && pnpm install && pnpm dev
```

## Features

- **Single Endpoint**: `/` - Returns the current Nimiq blockchain block height
- **Nimiq Integration**: Uses `@nimiq/core/bundler/worker-wasm` for Cloudflare Workers
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

### GET `/`

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
- **WASM Import**: Imports WASM as ES module and uses `initSync()` for initialization
- **Pico Mode**: Connects to Nimiq network in lightweight pico sync mode
- **TypeScript**: Compiled to JavaScript for Workers environment

### How It Works

The key to making `@nimiq/core` work on Cloudflare Workers:

1. **Use worker-wasm version** - Cloudflare Workers are themselves workers, so use `@nimiq/core/bundler/worker-wasm`
2. **WASM auto-initialization** - The patched version handles WebAssembly.Module initialization automatically
3. **Plain config objects** - Use simple config objects: `Client.create({ syncMode: 'pico' })`

**Implementation:**
```typescript
import { Client } from '@nimiq/core/bundler/worker-wasm'

let clientPromise: Promise<Client> | null = null

async function getClient() {
  if (!clientPromise) {
    clientPromise = Client.create({ syncMode: 'pico' }).catch((error) => {
      clientPromise = null // Reset so next request can retry
      throw error
    })
  }

  const client = await clientPromise

  // Check if consensus is established (with timeout)
  const isEstablished = await Promise.race([
    client.isConsensusEstablished(),
    new Promise<boolean>(resolve => setTimeout(() => resolve(false), 5000))
  ])

  if (!isEstablished) {
    // Wait for consensus with timeout
    await Promise.race([
      client.waitForConsensusEstablished(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Consensus timeout')), 25000)
      )
    ])
  }

  return client
}

export default {
  async fetch(request: Request): Promise<Response> {
    const client = await getClient()
    const blockNumber = await client.getHeadHeight()
    return Response.json({ blockNumber, success: true })
  }
}
```

**⚠️ IMPORTANT LIMITATIONS**

This starter demonstrates Nimiq integration on Cloudflare Workers but has **significant limitations** for production use:

**What Works:**
- ✅ Fast responses (~200-500ms) for rapid requests (within ~30 seconds of each other)
- ✅ Fresh data when Worker instance first starts
- ✅ Demonstrates WASM integration patterns

**What Doesn't Work:**
- ❌ **Stale data after idle**: After ~1-2 minutes idle, Cloudflare pauses the Worker and closes network connections. Subsequent requests return **stale block numbers** from when the Worker was last active
- ❌ **Cannot reconnect**: Nimiq's Rust WASM module initializes a global logging subscriber once per JavaScript runtime. Cloudflare reuses runtimes, making it impossible to recreate or reconnect the client without causing a panic
- ❌ **No real-time guarantee**: Block numbers only update while Worker is actively handling requests

**Why This Happens:**
1. Cloudflare Workers pause and reuse instances for efficiency
2. Network connections close during pause
3. Nimiq client can't detect or recover from this state
4. Attempting to recreate client causes: `SetGlobalDefaultError("a global default trace dispatcher has already been set")`

**Recommended Use Cases:**
- Learning Nimiq WASM integration
- Development/testing environments
- High-traffic apps with requests every ~10-20 seconds

**NOT Suitable For:**
- Production applications requiring real-time blockchain data
- Infrequent requests (>1 minute apart)
- Any use case where stale data is unacceptable

**Production Alternatives:**
- **Cloudflare Durable Objects**: Maintain persistent connections
- **Traditional Server**: Deploy to Node.js/long-running environment
- **RPC Node**: Poll an external Nimiq RPC node instead of local client
- **Hybrid Approach**: Cache data in Workers, fetch from RPC when stale

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

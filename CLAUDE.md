# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing Nimiq blockchain integration starter templates for different JavaScript frameworks. Currently includes Vue 3 + TypeScript, React + TypeScript, Next.js, and Cloudflare Workers D1 starters.

## Workspace Configuration

- **Package Manager**: pnpm (configured in root package.json with `packageManager` field)
- **Workspace Structure**: pnpm workspaces with packages in `starters/*`
- **Dependencies**: Uses pnpm catalog features for centralized version management
- **Root Scripts**: Use `nr -r <script>` to run scripts across all workspaces in parallel

## Development Commands

### Root Level Commands
```bash
pnpm dev          # Start all starters in development mode
pnpm build        # Build all starters
pnpm test         # Run tests across all packages
pnpm lint         # Run ESLint across all packages
pnpm typecheck    # Run TypeScript checks
```

### Individual Starter Commands
Each starter supports these commands:
```bash
cd starters/<starter-name>
pnpm dev          # Development server
pnpm build        # Production build
pnpm test         # Run tests
pnpm typecheck    # TypeScript validation
```

### Specific Testing Commands
- **Vue TypeScript**: `pnpm --filter nimiq-vue-ts test` (browser tests with Vitest + Playwright)
- **React TypeScript**: `pnpm --filter nimiq-react-ts test` (browser tests with Vitest + Playwright)
- **Cloudflare Workers**: `pnpm --filter nimiq-cloudflare-d1 test` (unit tests with Vitest)
- **Next.js**: `pnpm --filter nimiq-nextjs test`

## Architecture & Key Components

### Nimiq Integration Pattern

All starters follow this integration pattern:

1. **Vite Configuration** (applies to vue-ts, react-ts):
   - `vite-plugin-wasm` for WebAssembly support
   - `vite-plugin-top-level-await` for async imports
   - Exclude `@nimiq/core` from optimization
   - ESNext target with ES modules output

2. **Nimiq Client Setup**:
   - **Web starters** (Vue/React): Use `@nimiq/core/web` with `init()` function
   - **Cloudflare Workers**: Use `@nimiq/core` bundler import (no /web suffix)
   - Client configuration with "pico" sync mode
   - Event listeners for consensus changes and head block updates
   - Proper error handling and cleanup

3. **State Management**:
   - **Vue**: Composable pattern with reactive refs (`useNimiq.ts`)
   - **React**: Hook pattern with useState (`useNimiq.ts`)
   - **Cloudflare**: Direct client creation in request handler

### Critical Vite Configuration

For web frameworks (Vue, React), the Vite config must include:

```typescript
// Required plugins for Nimiq WebAssembly integration
plugins: [wasm(), topLevelAwait()]
optimizeDeps: { exclude: ['@nimiq/core'] }
build: { target: 'esnext', rollupOptions: { output: { format: 'es' } } }
```

### Client Initialization Patterns

**Web Starters (Vue/React):**
```typescript
// Always use dynamic imports and init() for web
import init, * as Nimiq from '@nimiq/core/web'
await init()
const config = new Nimiq.ClientConfiguration()
config.syncMode('pico')
const client = await Nimiq.Client.create(config.build())
```

**Cloudflare Workers:**
```typescript
// Use bundler import (no init() needed)
import * as Nimiq from '@nimiq/core'
const config = new Nimiq.ClientConfiguration()
config.syncMode('pico')
const client = await Nimiq.Client.create(config.build())
```

### Event Handling
- Consensus changes: `addConsensusChangedListener()`
- New blocks: `addHeadChangedListener()` with block fetching
- Proper cleanup in framework lifecycle hooks

## Testing Strategy

- **Web Starters**: Browser tests with Vitest + Playwright for WebAssembly integration
- **Cloudflare Workers**: Unit tests with Vitest and ExecutionContext mocking
- **Browser Testing**: Use specific test commands that install Playwright browsers
- **CI**: Monthly scheduled runs in addition to push/PR triggers

## Browser Compatibility

- **Target**: Modern browsers with WebAssembly support
- **Build**: ESNext target, ES modules format
- **Dependencies**: @nimiq/core requires WebAssembly and top-level await

## Package Names

When filtering commands, use these exact package names:
- `nimiq-vue-ts` (Vue 3 + TypeScript)
- `nimiq-react-ts` (React + TypeScript)
- `nimiq-nextjs` (Next.js)
- `nimiq-cloudflare-d1` (Cloudflare Workers + D1)
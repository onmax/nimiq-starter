# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing Nimiq blockchain integration starter templates for different JavaScript frameworks. Currently includes Vue 3 + TypeScript starter with plans for React, Svelte, and other frameworks.

## Workspace Configuration

- **Package Manager**: pnpm (configured in root package.json with `packageManager` field)
- **Workspace Structure**: pnpm workspaces with packages in `starters/*` and `docs`
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

### Vue TypeScript Starter (`starters/vue-ts`)
```bash
cd starters/vue-ts
pnpm dev                    # Development server
pnpm build                  # Production build
pnpm type-check             # TypeScript validation
pnpm test:unit              # Unit tests with Vitest
pnpm test:browser           # Browser tests with Playwright
pnpm lint                   # ESLint with auto-fix
pnpm format                 # Prettier formatting
```

## Architecture & Key Components

### Nimiq Integration Pattern

All starters follow this integration pattern:

1. **Vite Configuration** (`vite.config.ts`):
   - `vite-plugin-wasm` for WebAssembly support
   - `vite-plugin-top-level-await` for async imports
   - Exclude `@nimiq/core` from optimization
   - ESNext target with ES modules output

2. **Nimiq Client Setup** (`src/composables/useNimiq.ts`):
   - Async dynamic import of `@nimiq/core`
   - Client configuration with "pico" sync mode
   - Event listeners for consensus changes and head block updates
   - Proper error handling and cleanup

3. **Reactive State Management**:
   - Vue composable pattern with reactive refs
   - Real-time consensus status monitoring
   - Block height tracking with head change listeners

### Project Structure

```
├── starters/
│   └── vue-ts/                     # Vue 3 + TypeScript starter
│       ├── src/
│       │   ├── components/
│       │   │   └── NimiqDemo.vue   # Main demo component
│       │   ├── composables/
│       │   │   └── useNimiq.ts     # Nimiq client management
│       │   └── tests/              # Unit and browser tests
│       ├── vite.config.ts          # Vite + WebAssembly config
│       └── vitest.config.ts        # Test configuration
├── docs/                           # Documentation (planned)
└── pnpm-workspace.yaml             # Workspace configuration with catalogs
```

## Testing Strategy

### Vue Starter Testing
- **Unit Tests**: Vitest with jsdom environment
- **Browser Tests**: Vitest + Playwright for WebAssembly integration
- **Configuration**: Shared Vite config between dev and test environments
- **Browser Testing**: Use `pnpm test:browser` for full Nimiq integration tests

### Adding New Tests
- Unit tests in `src/tests/` directory
- Browser tests for WebAssembly/Nimiq functionality require `test:browser` command
- Screenshot failure capture disabled but configurable in `vitest.config.ts`

## Code Quality & Linting

### ESLint Configuration
- Vue 3 + TypeScript setup with flat config format
- Prettier integration for formatting
- Vitest plugin for test files
- Global ignores for build artifacts

### Pre-commit Hooks
- Automatic `pnpm install` with frozen lockfile
- Lint-staged runs ESLint on all changed files

## Nimiq-Specific Implementation Notes

### Critical Vite Configuration
```typescript
// Required plugins for Nimiq WebAssembly integration
plugins: [wasm(), topLevelAwait()]
optimizeDeps: { exclude: ['@nimiq/core'] }
build: { target: 'esnext', rollupOptions: { output: { format: 'es' } } }
```

### Client Initialization Pattern
```typescript
// Always use dynamic imports for @nimiq/core
const Nimiq = await import('@nimiq/core')
const config = new Nimiq.ClientConfiguration()
config.syncMode('pico') // Lightweight sync mode
const client = await Nimiq.Client.create(config.build())
```

### Event Handling
- Consensus changes: `addConsensusChangedListener()`
- New blocks: `addHeadChangedListener()` with block fetching
- Proper cleanup in Vue `onUnmounted()` hooks

## Adding New Framework Starters

1. Create new directory in `starters/`
2. Install framework-specific dependencies
3. Configure Vite with WebAssembly plugins (copy from vue-ts starter)
4. Implement Nimiq client initialization pattern
5. Add demo component showing blockchain connectivity
6. Configure testing setup (unit + browser tests for WebAssembly)
7. Update root README.md

## Browser Compatibility

- **Target**: Modern browsers with WebAssembly support
- **Build**: ESNext target, ES modules format
- **Dependencies**: @nimiq/core requires WebAssembly and top-level await

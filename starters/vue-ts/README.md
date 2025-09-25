# Nimiq Vue 3 + TypeScript Starter

A modern Vue 3 starter template with complete Nimiq blockchain integration, featuring live consensus monitoring and real-time block updates.

## Quick Start

```bash
npx degit onmax/nimiq-starter/starters/vue-ts my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

## Features

- ⚡️ **Vite** for fast development and building
- 🏷️ **TypeScript** for type safety and better developer experience
- 🎨 **Vue 3 Composition API** with reactive components
- 🌐 **Nimiq Core** (@nimiq/core) fully integrated with WebAssembly support
- 📡 **Live Blockchain Updates** - watch consensus and block changes in real-time
- 🔧 **Optimized WebAssembly Configuration** for Nimiq
- 🧪 **Vitest** for unit testing
- 📝 **ESLint + Prettier** for code formatting and quality
- 🚀 **Vue Router** for navigation
- 📦 **Pinia** for state management

## What This Demo Shows

The included `NimiqDemo.vue` component demonstrates:

1. **Nimiq Client Initialization**: Proper async setup with error handling
2. **Consensus State Monitoring**: Real-time updates showing connection status
3. **Block Height Updates**: Live display of current blockchain height
4. **Event-Driven UI**: Reactive interface that responds to blockchain events

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Preview production build
pnpm preview
```

## Nimiq Integration Details

### Vite Configuration

The `vite.config.ts` includes essential plugins for Nimiq:

```typescript
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [
    vue(),
    wasm(), // WebAssembly support
    topLevelAwait(), // Top-level await support
  ],
  worker: {
    plugins: () => [wasm(), topLevelAwait()]
  },
  optimizeDeps: {
    exclude: ['@nimiq/core'], // Exclude from Vite optimization
  },
})
```

### Client Initialization

```typescript
// Dynamic import for proper WebAssembly loading
const Nimiq = await import('@nimiq/core')
const config = new Nimiq.ClientConfiguration()
const client = await Nimiq.Client.create(config.build())

// Set up event listeners
client.addConsensusChangedListener((state) => {
  consensusState.value = state
})

client.addHeadChangedListener((hash, reason, revertedBlocks, adoptedBlocks) => {
  if (adoptedBlocks.length > 0) {
    currentBlockHeight.value = adoptedBlocks[adoptedBlocks.length - 1].height
  }
})
```

## Project Structure

```
src/
├── components/
│   └── NimiqDemo.vue      # Main demo component with blockchain integration
├── router/
│   └── index.ts          # Vue Router configuration
├── stores/
│   └── counter.ts        # Pinia store example
├── views/
│   ├── HomeView.vue      # Home page
│   └── AboutView.vue     # About page
├── App.vue               # Root component
└── main.ts               # Application entry point
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Development

### Using the Nimiq Client

The Nimiq client provides access to the full Nimiq blockchain:

- **Consensus monitoring**: Track connection and sync status
- **Block updates**: Subscribe to new blocks as they're mined
- **Wallet operations**: Generate addresses, sign transactions
- **Network info**: Access blockchain data and statistics

### TypeScript Support

Full TypeScript support is provided for:
- Vue components with `<script setup>`
- Nimiq API types and interfaces
- Proper type checking for blockchain operations

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Nimiq Developer Center](https://www.nimiq.com/developers/)
- [Nimiq Core API Reference](https://github.com/nimiq/core-js)
- [Vite Documentation](https://vitejs.dev/)

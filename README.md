# Nimiq Starter Templates

A monorepo containing starter templates for integrating Nimiq web client with different JavaScript frameworks. Learn how to build decentralized applications using the Nimiq blockchain in various popular web frameworks.

## What is Nimiq?

Nimiq is a browser-based blockchain and ecosystem that makes cryptocurrencies accessible to everyone. The Nimiq web client allows you to build decentralized applications directly in the browser using WebAssembly, without requiring any server-side infrastructure.

## Available Starters

### 🚀 Vue 3 + TypeScript (`starters/vue-ts`)

A modern Vue 3 starter template with complete Nimiq integration, featuring:

- ⚡️ **Vite** for lightning-fast development
- 🏷️ **TypeScript** for type safety
- 🎨 **Vue 3 Composition API** for modern reactive components
- 🌐 **Nimiq Core (@nimiq/core)** fully integrated
- 🔧 **WebAssembly** configuration for optimal performance
- 📡 **Live blockchain updates** with reactive consensus status
- 🧪 **Vitest** for comprehensive testing
- 📝 **ESLint + Prettier** for code quality

**Demo Features:**
- Initialize Nimiq client with real-time status updates
- Live consensus state monitoring (Connecting → Syncing → Established)
- Real-time block height updates as new blocks are mined
- Reactive UI that responds to blockchain events

## Quick Start

### Clone a specific starter

```bash
# Vue TypeScript starter
npx degit antfu/nimiq-starter-monorepo/starters/vue-ts my-nimiq-app
cd my-nimiq-app
pnpm install
pnpm dev
```

### Work with the full monorepo

```bash
git clone https://github.com/antfu/nimiq-starter-monorepo.git
cd nimiq-starter-monorepo
pnpm install

# Start all development servers
pnpm dev

# Build all starters
pnpm build

# Run tests
pnpm test
```

## Project Structure

```
nimiq-starter-monorepo/
├── starters/
│   └── vue-ts/              # Vue 3 + TypeScript + Nimiq
│       ├── src/
│       │   ├── components/
│       │   │   └── NimiqDemo.vue  # Live blockchain demo
│       │   └── App.vue
│       ├── vite.config.ts   # Vite + WebAssembly config
│       └── package.json
├── docs/                    # Documentation (planned)
├── package.json            # Root workspace configuration
└── pnpm-workspace.yaml     # Workspace configuration
```

## Nimiq Integration Guide

Each starter includes:

1. **Proper Vite Configuration**: WebAssembly and top-level await support
2. **Nimiq Client Setup**: Async initialization with error handling
3. **Consensus Monitoring**: Real-time status updates using event listeners
4. **Block Updates**: Subscribe to new blocks and display current height
5. **TypeScript Support**: Full type safety for Nimiq APIs

### Key Integration Steps

1. Install required dependencies:
   ```bash
   pnpm add @nimiq/core
   pnpm add -D vite-plugin-wasm vite-plugin-top-level-await
   ```

2. Configure Vite for WebAssembly:
   ```js
   import topLevelAwait from 'vite-plugin-top-level-await'
   // vite.config.ts
   import wasm from 'vite-plugin-wasm'

   export default defineConfig({
     plugins: [wasm(), topLevelAwait()],
     optimizeDeps: { exclude: ['@nimiq/core'] }
   })
   ```

3. Initialize Nimiq client:
   ```js
   const Nimiq = await import('@nimiq/core')
   const client = await Nimiq.Client.create(config.build())
   ```

## Future Starters

Coming soon:
- **React + TypeScript** starter
- **Vanilla JavaScript** starter
- **Svelte + TypeScript** starter
- **Next.js** starter

## Contributing

Contributions are welcome! To add a new framework starter:

1. Create a new directory in `starters/`
2. Set up your framework with proper Nimiq integration
3. Include a demo component showing blockchain connectivity
4. Add documentation and update this README
5. Ensure all tests pass

## License

[MIT](./LICENSE) License © [Anthony Fu](https://github.com/antfu)

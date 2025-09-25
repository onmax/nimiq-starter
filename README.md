# Nimiq Starter Templates

A monorepo containing starter templates for integrating Nimiq web client with different JavaScript frameworks. Learn how to build decentralized applications using the Nimiq blockchain in various popular web frameworks.

## What is Nimiq?

Nimiq is a browser-based blockchain and ecosystem that makes cryptocurrencies accessible to everyone. The Nimiq web client allows you to build decentralized applications directly in the browser using WebAssembly, without requiring any server-side infrastructure.

## Quick Start - Choose Your Template

Pick your preferred framework and run one command to get started:

### Vue 3 + TypeScript
```bash
npx degit onmax/nimiq-starter/starters/vue-ts my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

### React + TypeScript
```bash
npx degit onmax/nimiq-starter/starters/react-ts my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

### Next.js + TypeScript
```bash
npx degit onmax/nimiq-starter/starters/next-js my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

### Cloudflare Workers + D1
```bash
npx degit onmax/nimiq-starter/starters/cloudflare-d1 my-nimiq-worker
cd my-nimiq-worker && pnpm install && pnpm dev
```

### Alternative using giget
```bash
# Vue
npx giget@latest gh:onmax/nimiq-starter/starters/vue-ts my-nimiq-app

# React
npx giget@latest gh:onmax/nimiq-starter/starters/react-ts my-nimiq-app

# Next.js
npx giget@latest gh:onmax/nimiq-starter/starters/next-js my-nimiq-app

# Cloudflare Workers
npx giget@latest gh:onmax/nimiq-starter/starters/cloudflare-d1 my-nimiq-worker
```

## Available Templates

### Vue 3 + TypeScript
**Perfect for**: Modern reactive web apps with composition API
- ⚡️ Vite for lightning-fast development
- 🏷️ Full TypeScript support
- 🎨 Vue 3 Composition API with reactive Nimiq integration
- 📡 Real-time blockchain updates and consensus monitoring
- 🧪 Vitest for unit and browser testing
- 📝 ESLint + Prettier for code quality

### React + TypeScript
**Perfect for**: Component-based web applications
- ⚡️ Vite-powered React 18 with TypeScript
- 🪝 Custom `useNimiq` hook for blockchain state management
- 🎨 Minimal Pico CSS styling
- 🧪 Browser testing with Vitest + Playwright
- 📱 Modern React patterns with hooks

### Next.js + TypeScript
**Perfect for**: Full-stack applications with SSR/SSG
- 🚀 Next.js with App Router
- 🏷️ TypeScript throughout
- 🌐 Server and client-side Nimiq integration
- 📦 Optimized bundling and WebAssembly support

### Cloudflare Workers + D1
**Perfect for**: Serverless blockchain APIs
- 🌩️ Cloudflare Workers runtime with D1 database
- 🪶 Lightweight pico sync mode
- 📡 Single `/block-number` API endpoint
- ⚡️ Edge computing with WebAssembly support

## Full Monorepo Development

Want to work with all templates or contribute? Clone the full repository:

```bash
git clone https://github.com/onmax/nimiq-starter.git
cd nimiq-starter
pnpm install

# Start all development servers
pnpm dev

# Build all starters
pnpm build

# Run tests across all projects
pnpm test

# Lint and format
pnpm lint
pnpm typecheck
```

## Project Structure

```
nimiq-starter/
├── starters/
│   ├── vue-ts/              # Vue 3 + TypeScript starter
│   ├── react-ts/            # React + TypeScript starter
│   ├── next-js/             # Next.js starter
│   └── cloudflare-d1/       # Cloudflare Workers starter
├── package.json             # Root workspace configuration
└── pnpm-workspace.yaml      # pnpm workspace configuration
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

## Future Templates

Want to see support for another framework? [Open an issue](https://github.com/onmax/nimiq-starter/issues/new) and let us know!

Potential templates:
- **Svelte + TypeScript** - Component-based development with Svelte
- **Vanilla TypeScript** - Pure TypeScript without frameworks
- **Nuxt 3** - Full-stack Vue.js framework
- **Astro** - Modern static site generator
- **Node.js API** - Server-side blockchain integration

## Contributing

Contributions are welcome! To add a new framework starter:

1. Create a new directory in `starters/`
2. Set up your framework with proper Nimiq integration
3. Include a demo component showing blockchain connectivity
4. Add documentation and update this README
5. Ensure all tests pass

## License

MIT License

# Nimiq React + TypeScript Starter

A minimal starter template for integrating Nimiq blockchain with React and TypeScript, built with Vite.

## Live Demo

[https://nimiq-starter-react-ts.vercel.app](https://nimiq-starter-react-ts.vercel.app)

## Quick Start

```bash
npx degit onmax/nimiq-starter/starters/react-ts my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

## Features

- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development and building
- 🔗 Nimiq Core integration with WebAssembly support
- 🎨 Pico CSS for minimal styling
- 🧪 Vitest for testing (unit + browser tests)
- 🔧 TypeScript configuration optimized for Vite

## Getting Started

### Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Commands

```bash
pnpm dev                    # Development server
pnpm build                  # Production build
pnpm typecheck              # TypeScript validation
pnpm test                   # Browser tests with Playwright
pnpm preview                # Preview production build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── NimiqDemo.tsx   # Main demo component
│   ├── hooks/
│   │   └── useNimiq.ts     # Nimiq client management hook
│   ├── tests/              # Browser integration tests
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── vite.config.ts          # Vite + WebAssembly config
└── vitest.config.ts        # Test configuration
```

## Nimiq Integration

This starter demonstrates connecting to the Nimiq blockchain using the lightweight "pico" sync mode. The integration includes:

- **Real-time connection status** - Shows consensus state
- **Block tracking** - Displays current block height
- **Error handling** - Graceful error display and recovery
- **WebAssembly support** - Proper Vite configuration for @nimiq/core

### Key Components

- **`useNimiq` Hook** (`src/hooks/useNimiq.ts`): Manages Nimiq client state and lifecycle
- **`NimiqDemo` Component** (`src/components/NimiqDemo.tsx`): UI for connection and status display

### Testing

Browser tests verify the complete integration:

```bash
# Run browser tests (requires Chromium via Playwright)
pnpm test
```

The test connects to the Nimiq network and validates:
- Successful client initialization
- Consensus establishment
- Block height reporting

## Technical Details

### Vite Configuration

The Vite configuration includes essential plugins for Nimiq:

- `vite-plugin-wasm` - WebAssembly support
- `vite-plugin-top-level-await` - Async imports
- `@nimiq/core` excluded from optimization
- ESNext target with ES modules output

### Browser Compatibility

- Modern browsers with WebAssembly support
- ES2020+ JavaScript features
- Top-level await support

## Learn More

- [Nimiq Documentation](https://nimiq.com/developers/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)

## License

MIT

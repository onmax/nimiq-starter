# Nimiq Next.js Starter

A Next.js application template with Nimiq blockchain integration.

## Features

- Next.js 15 with App Router
- TypeScript support
- Nimiq blockchain client integration
- WebAssembly support
- Client-side only rendering for blockchain components
- React hooks for state management
- Error boundaries for robust error handling
- Comprehensive test setup (unit and browser tests)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/               # Next.js app router pages
├── components/        # React components
│   ├── NimiqDemo.tsx # Main Nimiq integration component
│   └── ErrorBoundary.tsx
├── hooks/            # React hooks
│   └── useNimiq.ts  # Nimiq client management hook
├── tests/           # Test files
│   ├── unit/       # Unit tests
│   └── browser/    # Browser tests for WebAssembly
└── next.config.mjs  # Next.js configuration with WebAssembly support
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run all tests
- `pnpm test:unit` - Run unit tests only
- `pnpm test:browser` - Run browser tests with WebAssembly
- `pnpm typecheck` - Run TypeScript type checking

## Nimiq Integration

The application uses the `@nimiq/core` library to connect to the Nimiq blockchain:

1. **useNimiq Hook**: Manages the Nimiq client lifecycle and state
2. **Client-side Only**: Uses Next.js dynamic imports with `ssr: false` for WebAssembly compatibility
3. **Pico Sync Mode**: Uses lightweight synchronization for optimal browser performance
4. **Real-time Updates**: Subscribes to consensus changes and new blocks

## Testing

The starter includes comprehensive testing setup:

- **Unit Tests**: Using Vitest and React Testing Library
- **Browser Tests**: Using Vitest browser mode with Playwright for WebAssembly testing

## WebAssembly Configuration

The Next.js configuration includes WebAssembly support in next.config.mjs with asyncWebAssembly and topLevelAwait enabled in the webpack experiments configuration.

## License

MIT

# Nimiq Next.js Starter (Turbopack)

Next.js starter with Nimiq blockchain using Turbopack bundler.

> **⚠️ Known Limitation**: Turbopack doesn't fully support WebAssembly worker scripts yet. Worker loading may fail. Use the webpack version for production.

## Live Demo

[https://nimiq-starter-next-js.vercel.app](https://nimiq-starter-next-js.vercel.app)

## Quick Start

```bash
npx degit onmax/nimiq-starter/starters/nextjs-turbopack my-nimiq-app
cd my-nimiq-app && pnpm install && pnpm dev
```

## Development Commands

```bash
pnpm install  # Install dependencies
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Attribution

Based on the original implementation by [DovAzencot](https://github.com/DovAzencot/nimiq-nextjs/)

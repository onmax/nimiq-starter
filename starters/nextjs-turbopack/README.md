# Nimiq Next.js Starter (Turbopack)

Next.js starter with Nimiq blockchain using Turbopack bundler.

> **✅ Technical Solution**: Uses pnpm patch to fix worker `importScripts()` paths for Turbopack compatibility.
>
> **⚠️ Performance**: Turbopack dev server startup is significantly slower than webpack. Use webpack version for development/production.

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

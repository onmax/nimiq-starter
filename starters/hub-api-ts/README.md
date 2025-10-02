# Nimiq Hub API - TypeScript Starter

A minimal TypeScript + Vite starter template for integrating the Nimiq Hub API.

## Features

- 🚀 Vite for fast development and optimized builds
- 📘 TypeScript for type safety
- 🔐 Nimiq Hub API integration
- ✅ Playwright browser testing with Vitest
- 🎨 Clean, responsive UI

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

# Type check
pnpm typecheck
```

## What's Included

This starter demonstrates three core Hub API operations:

### Choose Address
Let users select one of their wallet addresses.

```ts
const result = await hubApi.chooseAddress({
  appName: 'Your App Name'
})
console.log(result.address, result.label)
```

### Sign Message
Request users to sign a message for authentication.

```ts
const result = await hubApi.signMessage({
  appName: 'Your App Name',
  message: 'Sign in to my app'
})
console.log(result.signer, result.signature)
```

### Checkout (Payment)
Request a payment from the user.

```ts
const result = await hubApi.checkout({
  appName: 'Your App Name',
  recipient: 'NQ07 0000...',
  value: 100000, // Luna (1 NIM = 100,000 Luna)
  extraData: 'Order #123'
})
console.log(result.hash)
```

## Project Structure

```
hub-api-ts/
├── src/
│   ├── main.ts              # Hub API integration
│   └── tests/
│       └── hub-api.browser.test.ts  # Browser tests
├── index.html               # Entry point
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## Testing

The starter includes browser-based tests using Vitest + Playwright:

```bash
pnpm test
```

Tests verify:
- Hub API initialization
- UI rendering
- Button functionality

## Learn More

- [Hub API Documentation](https://nimiq.github.io/hub)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

## Network Configuration

By default, this starter uses **testnet**:

```ts
const hubApi = new HubApi('https://hub.nimiq-testnet.com')
```

For **mainnet**, change to:

```ts
const hubApi = new HubApi('https://hub.nimiq.com')
```

## Notes

- Hub API requires user interaction (click events) to avoid popup blockers
- Don't set COOP/COEP headers as they break Hub communication
- All Hub operations are asynchronous and return promises

## License

MIT

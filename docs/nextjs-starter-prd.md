# Product Requirements Document: Next.js Nimiq Starter

## 1. Executive Summary

This PRD outlines the requirements for creating a Next.js starter template that integrates with the Nimiq blockchain, following the established patterns from the existing Vue TypeScript starter in the monorepo.

## 2. Project Context

### Background
- Part of the Nimiq starter templates monorepo
- Follows existing Vue TypeScript starter patterns
- Must maintain consistency with workspace configuration
- Requires client-side only rendering for WebAssembly support

### Goals
- Provide a production-ready Next.js template for Nimiq blockchain integration
- Maintain feature parity with Vue starter
- Ensure seamless CI/CD integration
- Enable developers to quickly start building Nimiq-powered Next.js applications

## 3. Technical Requirements

### 3.1 Framework & Build Configuration
- **Framework**: Next.js 14+ with App Router
- **TypeScript**: Full TypeScript support with strict mode
- **Build Tool**: Next.js built-in webpack configuration
- **WebAssembly Support**: Configure webpack for WASM modules
- **Top-level Await**: Enable async module loading
- **Client-Side Rendering**: Disable SSR for Nimiq components

### 3.2 Nimiq Integration
- **Core Library**: @nimiq/core v2.1.1
- **Sync Mode**: Pico (lightweight) mode
- **State Management**: React hooks for reactive state
- **Event Handling**: Consensus and head block listeners
- **Error Handling**: Comprehensive error boundaries

### 3.3 Project Structure
```
starters/nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── NimiqDemo.tsx
│   ├── hooks/
│   │   └── useNimiq.ts
│   └── lib/
│       └── nimiq-client.ts
├── tests/
│   ├── unit/
│   └── browser/
├── public/
├── next.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── playwright.config.ts
```

### 3.4 Core Components

#### useNimiq Hook
- Initialize Nimiq client with dynamic import
- Manage connection state (loading, error, connected)
- Track consensus state
- Monitor head block height
- Cleanup on unmount

#### NimiqDemo Component
- Display connection status
- Show current consensus state
- Display blockchain height
- Error handling UI
- Loading states

### 3.5 Testing Requirements
- **Unit Tests**: Vitest with React Testing Library
- **Browser Tests**: Playwright for WASM integration
- **Coverage**: Minimum 80% code coverage
- **CI Integration**: Run in GitHub Actions

### 3.6 Development Experience
- Hot Module Replacement (HMR)
- TypeScript type checking
- ESLint configuration
- Prettier formatting
- Development server with HTTPS support

## 4. Implementation Tasks

### Phase 1: Project Setup
1. Create Next.js application structure
2. Configure pnpm workspace integration
3. Set up TypeScript configuration
4. Configure webpack for WebAssembly

### Phase 2: Nimiq Integration
5. Implement useNimiq hook
6. Create NimiqDemo component
7. Configure client-side only rendering
8. Add error boundaries

### Phase 3: Testing Infrastructure
9. Set up Vitest configuration
10. Configure Playwright for browser tests
11. Write unit tests for hooks
12. Write browser tests for integration

### Phase 4: CI/CD Integration
13. Update CI workflow for Next.js starter
14. Configure build and test scripts
15. Verify CI pipeline execution

### Phase 5: Documentation & Finalization
16. Update root README
17. Create starter-specific README
18. Add usage examples
19. Create branch and push changes

## 5. Success Criteria

- [ ] Next.js app successfully builds and runs
- [ ] Nimiq client connects and syncs in pico mode
- [ ] Real-time consensus and block updates work
- [ ] All tests pass (unit and browser)
- [ ] CI pipeline executes successfully
- [ ] WebAssembly modules load correctly
- [ ] No SSR errors for Nimiq components
- [ ] Development experience matches Vue starter quality

## 6. Dependencies & Constraints

### Dependencies
- @nimiq/core package availability
- WebAssembly browser support
- Node.js 18+ for development

### Constraints
- Must use pnpm package manager
- Must follow monorepo structure
- Client-side only for blockchain components
- Must maintain CI compatibility

## 7. Risk Mitigation

| Risk | Mitigation Strategy |
|------|-------------------|
| WebAssembly webpack configuration complexity | Reference existing Next.js WASM examples |
| SSR conflicts with Nimiq | Use dynamic imports with ssr: false |
| Test environment setup for WASM | Use Playwright for browser-based testing |
| CI performance with browser tests | Cache dependencies and Playwright browsers |

## 8. Timeline Estimate

- Phase 1 (Setup): 30 minutes
- Phase 2 (Integration): 45 minutes
- Phase 3 (Testing): 45 minutes
- Phase 4 (CI/CD): 30 minutes
- Phase 5 (Documentation): 20 minutes

Total estimated time: ~3 hours

## 9. Acceptance Criteria

The project will be considered complete when:
1. Next.js starter is fully functional with Nimiq integration
2. Feature parity with Vue starter is achieved
3. All tests pass in local and CI environments
4. Documentation is complete and accurate
5. Code is merged to a feature branch
6. CI pipeline validates the implementation

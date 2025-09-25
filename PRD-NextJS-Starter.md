# PRD: Nimiq Next.js Starter Implementation

## Overview
Implement a Next.js TypeScript starter for Nimiq blockchain integration, mirroring the existing Vue TypeScript starter functionality while following the architectural pattern from the reference implementation.

## Requirements

### Core Features
1. **Nimiq Client Integration**
   - Initialize Nimiq client with pico sync mode
   - Real-time consensus state monitoring
   - Block height tracking with head change listeners
   - Proper error handling and cleanup

2. **UI Components**
   - Connect button (disabled when loading or connected)
   - Connection status display
   - Real-time consensus state and block number display
   - Error state handling with user-friendly messages

3. **State Management**
   - React hooks-based state management following the reference pattern
   - Loading, error, and connection states
   - Real-time updates for consensus and block data

4. **Testing**
   - Playwright test for Nimiq connection functionality
   - Test should verify successful connection and positive block height
   - Follow Next.js testing documentation patterns

### Technical Requirements

1. **Configuration**
   - Next.js with TypeScript
   - WebAssembly support via next.config.js
   - PicoCSS for styling consistency with Vue starter
   - Proper ESLint and TypeScript configuration

2. **Architecture**
   - Follow the reference NimiqClient.tsx pattern from the GitHub repo
   - Mirror Vue starter functionality but adapted for React/Next.js
   - Proper cleanup in useEffect hooks
   - Client-side only component ('use client' directive)

3. **Dependencies**
   - @nimiq/core (from catalog)
   - Next.js 15.5.4+
   - React 19.1.0+
   - @playwright/test for testing
   - PicoCSS for consistent styling

## Implementation Tasks

1. **Setup & Configuration**
   - Configure next.config.js for WebAssembly support
   - Update TypeScript configuration if needed
   - Ensure proper package.json scripts

2. **Core Components**
   - Create useNimiq hook mirroring Vue composable functionality
   - Create NimiqClient component following reference implementation
   - Update main page to use the component

3. **Styling**
   - Import and configure PicoCSS
   - Mirror Vue starter UI layout and styling
   - Ensure responsive design

4. **Testing**
   - Create Playwright test mirroring Vue browser test functionality
   - Test connection establishment and block height retrieval
   - Configure test scripts in package.json

5. **Documentation**
   - Update component with proper TypeScript types
   - Ensure code follows project conventions

## Success Criteria

1. ✅ Next.js starter runs successfully with `pnpm dev`
2. ✅ Connect button initiates Nimiq client connection
3. ✅ UI displays real-time consensus state and block height
4. ✅ Error handling works properly
5. ✅ Playwright test passes, verifying blockchain connection
6. ✅ Code follows project conventions and TypeScript best practices
7. ✅ Build process completes without errors
8. ✅ Consistent UI/UX with Vue starter
# Nimiq Core Logging Subscriber Issue on Cloudflare Workers

## Executive Summary

The Nimiq Rust WASM client cannot be recreated or reconnected in Cloudflare Workers due to a **global logging subscriber limitation**. The `tracing-subscriber` Rust library initializes a global default subscriber that can only be set once per JavaScript runtime. Since Cloudflare Workers **reuse JavaScript runtimes** across multiple requests, attempting to create a new Nimiq client causes a panic.

## The Problem

### What Happens
1. First request: Client created successfully → logging initialized → works correctly
2. Worker pauses after ~1-2 minutes of idle time
3. Network connections close during pause
4. Subsequent request attempts to create new client → **PANIC**: `SetGlobalDefaultError("a global default trace dispatcher has already been set")`

### Error Message
```
error code: 1101
panic | thread '<unnamed>' panicked at 'failed to set global default subscriber: SetGlobalDefaultError(..)'
```

## Root Cause Analysis

### Source Code Investigation

The issue originates in the Nimiq web client initialization flow:

#### 1. Client Creation Entry Point
**File**: `web-client/src/client/lib.rs:125-136`

```rust
pub async fn create(config: &PlainClientConfigurationType) -> Result<Client, JsError> {
    let plain_config: PlainClientConfiguration =
        serde_wasm_bindgen::from_value((*config).clone())?;
    let web_config = ClientConfiguration::try_from(plain_config)?;

    let log_settings = LogSettings {
        level: Some(LevelFilter::from_str(web_config.log_level.as_str())?),
        ..Default::default()
    };

    // Initialize logging with config values.
    initialize_web_logging(Some(&log_settings)).expect("Web logging initialization failed");

    // ... rest of client initialization
}
```

**Key Issue**: Every call to `Client::create()` invokes `initialize_web_logging()`.

#### 2. Logging Initialization
**File**: `lib/src/extras/web_logging.rs:33-59`

```rust
pub fn initialize_web_logging(settings_opt: Option<&LogSettings>) -> Result<(), Error> {
    // Get config from config file
    let settings = settings_opt.cloned().unwrap_or_default();

    // Set logging level for Nimiq and all other modules
    let mut filter = Targets::new()
        .with_default(DEFAULT_LEVEL)
        .with_nimiq_targets(settings.level.unwrap_or(DEFAULT_LEVEL))
        .with_target("r1cs", LevelFilter::WARN);
    // Set logging level for specific selected modules
    filter = filter.with_targets(settings.tags);
    // Set logging level from the environment
    filter = filter.with_env();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .with_writer(MakeWebConsoleWriter::new())
                .with_ansi(false)
                .event_format(Formatting(MaybeSystemTime(settings.timestamps)))
                .with_filter(filter),
        )
        .init();  // ⚠️ THIS IS THE PROBLEM
    Ok(())
}
```

**Critical Line 57**: `.init()` calls `tracing::subscriber::set_global_default()` internally.

#### 3. The Global State Problem

The `tracing-subscriber` library uses a global variable to track whether a default subscriber has been set:

```rust
// From tracing-subscriber internals (not in Nimiq code)
pub fn set_global_default(subscriber: impl Subscriber + Send + Sync + 'static)
    -> Result<(), SetGlobalDefaultError>
{
    // Returns error if already set
}
```

This can **only succeed once per Rust runtime**.

### Why Cloudflare Workers Trigger This

| Environment | Behavior | Result |
|------------|----------|---------|
| **Browser** | Each page reload creates fresh JavaScript runtime | ✅ Works - new runtime per session |
| **Node.js** | Process runs continuously, client created once | ✅ Works - single initialization |
| **Cloudflare Workers** | Runtime **reused** across requests for efficiency | ❌ **FAILS** - second `Client.create()` panics |

Cloudflare Workers deliberately reuse JavaScript/WASM runtimes to improve performance and reduce cold starts. This design choice directly conflicts with Nimiq's global logging initialization.

## JavaScript-Level Patches Cannot Fix This

### What We Tried

#### Attempt 1: Guard `__wbindgen_start()`
**Patch**: Added global flag to prevent re-initialization
```javascript
if (typeof wasmExports?.__wbindgen_start === 'function') {
  if (!globalThis.__nimiq_wasm_started) {
    wasmExports.__wbindgen_start()
    globalThis.__nimiq_wasm_started = true
  }
}
```
**Result**: ❌ Still panics - logging is initialized in `Client::create()`, not `__wbindgen_start()`

#### Attempt 2: Client Caching
**Code**: Reuse same client instance across requests
```typescript
let clientPromise: Promise<Client> | null = null
async function getClient() {
  if (!clientPromise) {
    clientPromise = Client.create({ syncMode: 'pico' })
  }
  return clientPromise
}
```
**Result**: ⚠️ Partially works but returns stale data after network connections close

#### Attempt 3: Disconnect/Reconnect Network
**Code**:
```typescript
await client.disconnectNetwork()
await client.connectNetwork()
```
**Result**: ❌ Still returns stale data - client cannot detect connection state

### Why Patches Fail

The issue is **architectural**:
- Logging initialization happens **inside Rust code** during `Client::create()`
- JavaScript/WASM boundaries cannot intercept Rust function calls
- The global subscriber is a **Rust-level global**, not accessible from JavaScript
- No JavaScript patch can prevent Rust code from calling `init()` again

## Solutions (Require Rust Code Changes)

### Option 1: Conditional Logging Initialization ✅ Recommended
**Change**: `lib/src/extras/web_logging.rs`

```rust
use std::sync::atomic::{AtomicBool, Ordering};

static LOGGING_INITIALIZED: AtomicBool = AtomicBool::new(false);

pub fn initialize_web_logging(settings_opt: Option<&LogSettings>) -> Result<(), Error> {
    // Check if already initialized
    if LOGGING_INITIALIZED.swap(true, Ordering::SeqCst) {
        log::debug!("Logging already initialized, skipping");
        return Ok(());
    }

    let settings = settings_opt.cloned().unwrap_or_default();
    // ... rest of initialization

    tracing_subscriber::registry()
        .with(...)
        .init();
    Ok(())
}
```

**Pros**:
- Simple, minimal change
- Backward compatible
- Allows client recreation without panic

**Cons**:
- Cannot change log level after first initialization
- Shared state across client instances

### Option 2: Try-Catch Initialization ✅ Alternative
**Change**: `lib/src/extras/web_logging.rs`

```rust
pub fn initialize_web_logging(settings_opt: Option<&LogSettings>) -> Result<(), Error> {
    let settings = settings_opt.cloned().unwrap_or_default();

    // ... build filter and layers

    match tracing_subscriber::registry()
        .with(...)
        .try_init()
    {
        Ok(_) => log::debug!("Logging initialized successfully"),
        Err(_) => log::debug!("Logging already initialized"),
    }

    Ok(())
}
```

**Pros**:
- Gracefully handles re-initialization
- No panic on second call

**Cons**:
- Silently ignores new settings on subsequent calls

### Option 3: Remove Logging from Client Initialization ✅ Best Long-term
**Changes**:
1. Remove `initialize_web_logging()` from `Client::create()`
2. Require JavaScript to call initialization separately
3. Document initialization in user code

```rust
// In Client::create() - REMOVE THIS LINE:
// initialize_web_logging(Some(&log_settings)).expect("...");
```

```typescript
// User code must initialize logging once
import { initializeWebLogging } from '@nimiq/core/bundler/worker-wasm'

initializeWebLogging({ level: 'info' }) // Call once at startup

// Then create clients as needed
const client1 = await Client.create({ syncMode: 'pico' })
// ... later
const client2 = await Client.create({ syncMode: 'pico' }) // No panic
```

**Pros**:
- Complete separation of concerns
- Logging initialized independently of client
- Allows multiple clients without issues

**Cons**:
- Breaking change - requires user code updates
- More complex initialization for users

### Option 4: Per-Client Logging (Advanced) 🔧 Complex
**Concept**: Use per-subscriber filters instead of global default

```rust
// Would require significant refactoring
// Use tracing::Dispatch instead of global subscriber
```

**Pros**:
- Each client can have own logging config
- No global state

**Cons**:
- Major architectural change
- Requires refactoring throughout codebase

## Recommended Implementation

### Phase 1: Immediate Fix (Option 1)
Add atomic check to prevent re-initialization panic:

```rust
// lib/src/extras/web_logging.rs
use std::sync::atomic::{AtomicBool, Ordering};

static LOGGING_INITIALIZED: AtomicBool = AtomicBool::new(false);

pub fn initialize_web_logging(settings_opt: Option<&LogSettings>) -> Result<(), Error> {
    if LOGGING_INITIALIZED.swap(true, Ordering::SeqCst) {
        return Ok(());
    }

    // ... existing initialization code
}
```

### Phase 2: Better Solution (Option 3)
1. Create new function `initialize_logging()` exported to JavaScript
2. Update `Client::create()` to skip logging initialization
3. Update documentation and examples
4. Mark old behavior as deprecated

## Testing the Fix

### Before Fix
```bash
# First request
curl https://worker.dev/  # ✅ {"blockNumber":31829645,"success":true}

# Wait 2 minutes (connections close, runtime reused)

# Second request
curl https://worker.dev/  # ❌ Error 1101 (panic)
```

### After Fix (Option 1)
```bash
# First request
curl https://worker.dev/  # ✅ {"blockNumber":31829645,"success":true}

# Wait 2 minutes

# Second request
curl https://worker.dev/  # ✅ Works (may return stale data due to closed connections)
```

### After Full Fix (Option 3 + Connection Management)
```bash
# All requests work correctly with fresh data
```

## Impact on Environments

| Environment | Current Status | After Fix |
|------------|---------------|-----------|
| Browser | ✅ Works | ✅ Works |
| Node.js | ✅ Works | ✅ Works |
| Cloudflare Workers | ❌ Panics on reconnect | ✅ No panic (with limitations) |
| Deno/Bun | ⚠️ Unknown | ✅ Likely works |

## Related Issues

1. **Network Connection Management**: Even with logging fixed, client cannot detect closed connections in Workers
2. **Consensus State Detection**: `waitForConsensusEstablished()` hangs if network disconnected
3. **Runtime Lifecycle**: Need hooks for Workers pause/resume events

## Conclusion

The logging subscriber issue is a **fundamental architectural conflict** between:
- Nimiq's global logging initialization (designed for single-instance environments)
- Cloudflare Workers' runtime reuse strategy (designed for efficiency)

**JavaScript patches cannot fix this** - it requires changes to the Rust source code. The recommended approach is a **two-phase fix**:

1. **Immediate**: Add atomic guard to prevent panic (Option 1)
2. **Long-term**: Separate logging initialization from client creation (Option 3)

This issue affects any environment that reuses JavaScript/WASM runtimes, making it critical for serverless deployment strategies.

---

**Related Files**:
- `/home/maxi/nimiq/core-rs-albatross/web-client/src/client/lib.rs:136` - Client initialization
- `/home/maxi/nimiq/core-rs-albatross/lib/src/extras/web_logging.rs:33-59` - Logging setup
- `/home/maxi/nimiq/core-rs-albatross/lib/src/extras/logging.rs:77-214` - Alternative logging (non-web)
- `/home/maxi/nimiq/starter/starters/cloudflare-d1/src/index.ts` - Example affected code

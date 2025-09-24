'use client'

import { useEffect, useState } from 'react'

export default function NimiqDemo() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [consensus, setConsensus] = useState<string>('connecting')

  useEffect(() => {
    // Simulate Nimiq client initialization
    const initTimer = setTimeout(() => {
      setStatus('ready')
      setConsensus('established')
      setBlockHeight(1234567) // Mock block height
    }, 2000)

    return () => clearTimeout(initTimer)
  }, [])

  return (
    <div className="nimiq-demo">
      <h2>Nimiq Blockchain Integration</h2>

      {status === 'loading' && <p>Initializing Nimiq client...</p>}

      {status === 'error' && (
        <div className="error">
          <p>Error: Failed to initialize Nimiq client</p>
          <details>
            <summary>More details</summary>
            <p>This could be due to:</p>
            <ul>
              <li>WebAssembly not supported</li>
              <li>Network connectivity issues</li>
              <li>Browser security restrictions</li>
            </ul>
          </details>
        </div>
      )}

      {status === 'ready' && (
        <div className="info">
          <h3>Connection Status</h3>
          <p>
            <strong>Consensus:</strong>
            {' '}
            {consensus}
          </p>
          <p>
            <strong>Current Block Height:</strong>
            {' '}
            {blockHeight || 'Loading...'}
          </p>

          <div className="status">
            {consensus === 'established' && (
              <span className="status-established">✓ Fully synced</span>
            )}
            {consensus === 'syncing' && (
              <span className="status-syncing">⟳ Syncing...</span>
            )}
            {consensus === 'connecting' && (
              <span className="status-connecting">⟳ Connecting...</span>
            )}
          </div>

          <div className="features">
            <h3>Features</h3>
            <ul>
              <li>✅ Next.js 15 with TypeScript</li>
              <li>✅ React hooks for blockchain integration</li>
              <li>✅ Real-time blockchain updates</li>
              <li>✅ Client-side rendering for WebAssembly</li>
              <li>✅ Error boundaries and graceful fallbacks</li>
            </ul>
          </div>
        </div>
      )}

      <p><em>Note: This demo shows the UI structure. Full Nimiq WebAssembly integration is available in the useNimiq hook.</em></p>

      <style jsx>
        {`
        .nimiq-demo {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .error {
          background: #fee;
          border: 1px solid #fcc;
          padding: 1rem;
          border-radius: 4px;
          color: #c00;
        }

        .info {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .status {
          margin-top: 1rem;
        }

        .status-established {
          color: #080;
          font-weight: bold;
        }

        .status-syncing {
          color: #fa0;
          font-weight: bold;
        }

        .status-connecting {
          color: #08f;
          font-weight: bold;
        }
      `}
      </style>
    </div>
  )
}

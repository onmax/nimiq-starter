'use client'

import { useEffect } from 'react'
import { useNimiq } from '@/hooks/useNimiq'

export default function NimiqDemo() {
  const { initializeNimiq, client, loading, error, consensus, headBlockNumber } = useNimiq()

  useEffect(() => {
    initializeNimiq()
  }, [initializeNimiq])

  return (
    <div className="nimiq-demo">
      <h2>Nimiq Blockchain Integration</h2>

      {loading && <p>Initializing Nimiq client...</p>}

      {error && (
        <div className="error">
          <p>
            Error:
            {error}
          </p>
        </div>
      )}

      {client && !loading && (
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
            {headBlockNumber || 'Loading...'}
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
        </div>
      )}

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

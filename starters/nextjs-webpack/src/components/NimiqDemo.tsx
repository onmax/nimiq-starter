'use client'

import { useNimiq } from '../hooks/useNimiq'

export default function NimiqDemo() {
  const { client, loading, error, consensus, headBlockNumber, initializeNimiq } = useNimiq()

  const isConnected = client !== null
  const buttonText = isConnected ? 'Connected' : 'Connect to Nimiq'

  return (
    <main className="container">
      <article>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            disabled={loading || isConnected}
            aria-busy={loading}
            onClick={initializeNimiq}
          >
            {buttonText}
          </button>
        </div>

        {error && (
          <div role="alert">
            <strong>Error:</strong>
            {' '}
            {error}
          </div>
        )}

        {isConnected && (
          <div style={{ textAlign: 'center' }}>
            <p><strong>✓ Connected</strong></p>
            <p>
              <kbd>{consensus}</kbd>
              {' '}
              • Block
              <code>{headBlockNumber}</code>
            </p>
          </div>
        )}
      </article>
    </main>
  )
}

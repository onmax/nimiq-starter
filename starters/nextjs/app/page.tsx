'use client'

import dynamic from 'next/dynamic'

// Client-side only component for WebAssembly support
const NimiqDemo = dynamic(() => import('@/components/NimiqDemo'), {
  ssr: false,
  loading: () => <p>Loading Nimiq component...</p>,
})

export default function Home() {
  return (
    <div className="container-fluid" style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <hgroup style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3>Nimiq Next.js Starter</h3>
        <p><small>Nimiq web client integration demo</small></p>
      </hgroup>

      <NimiqDemo />
    </div>
  )
}

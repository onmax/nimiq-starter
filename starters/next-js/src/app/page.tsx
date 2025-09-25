'use client'

import dynamic from 'next/dynamic'

const NimiqDemo = dynamic(() => import('../components/NimiqDemo'), {
  ssr: false,
  loading: () => <p>Loading Nimiq...</p>,
})

export default function Home() {
  return <NimiqDemo />
}

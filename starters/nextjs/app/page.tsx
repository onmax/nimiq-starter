import dynamic from 'next/dynamic'
import styles from './page.module.css'

// Client-side only component for WebAssembly support
const NimiqDemo = dynamic(() => import('@/components/NimiqDemo'), {
  ssr: false,
  loading: () => <p>Loading Nimiq component...</p>,
})

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Nimiq Next.js Starter</h1>
        <p>A Next.js application with Nimiq blockchain integration</p>

        <NimiqDemo />

        <div className={styles.ctas}>
          <a
            href="https://nimiq.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primary}
          >
            Learn about Nimiq
          </a>
          <a
            href="https://github.com/nimiq/core-rs-albatross"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  )
}

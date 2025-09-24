import type { Metadata } from 'next'
import '@picocss/pico'

export const metadata: Metadata = {
  title: 'Nimiq Next.js Starter',
  description: 'Nimiq web client integration demo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

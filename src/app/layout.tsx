import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FunGame Hub — Play. Compete. Win.',
  description: 'Kumpulan game seru buat dimainkan sendiri atau bareng temen.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

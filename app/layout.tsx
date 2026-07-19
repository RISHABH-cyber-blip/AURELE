import type { Metadata } from 'next'
import { Fraunces, Inter, Space_Mono } from 'next/font/google'
import './globals.css'

// Modern thin serif for headings — matches the "fashion-editorial" direction
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Clean sans for body copy
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

// Monospace for SKUs / labels / prices in the "shop by style" filter chips
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Aurele — Timeless Pieces, Honestly Sourced',
    template: '%s | Aurele',
  },
  description:
    'Premium watches and fashion from brands worldwide — authenticated, curated, delivered.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-cream text-ink font-body antialiased">{children}</body>
    </html>
  )
}

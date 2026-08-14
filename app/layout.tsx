import type { Metadata } from 'next'
import { Fraunces, Inter, Space_Mono } from 'next/font/google'
import CookieBanner from '@/components/layout/CookieBanner'
import { getCookieConsent } from '@/lib/cookies'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

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
  description: 'Premium watches and fashion from brands worldwide — authenticated, curated, delivered.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the cookie consent decision server-side — this is what makes
  // it genuinely usable "everywhere," not just a client-side flag.
  const consent = await getCookieConsent()

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-cream text-ink font-body antialiased">
        {children}
        <CookieBanner initialConsent={consent} />
      </body>
    </html>
  )
}
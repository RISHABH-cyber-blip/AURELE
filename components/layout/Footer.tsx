'use client'

import { useState } from 'react'
import Link from 'next/link'
import LiveClock from '@/components/layout/LiveClock'

const FOOTER_COLUMNS = [
  { heading: 'Shop', links: [{ label: 'New Arrivals', href: '/shop' }, { label: "Men's", href: '/shop?category=mens' }, { label: "Women's", href: '/shop?category=womens' }, { label: 'Design Yours', href: '/customize' }] },
  { heading: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Authenticity', href: '/authenticity' }, { label: 'Contact', href: '/contact' }] },
  { heading: 'Support', links: [{ label: 'Track Order', href: '/track-order' }, { label: 'Returns', href: '/legal/refund-policy' }, { label: 'FAQ', href: '/support' }] },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubscribe() {
    if (!email) return
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) setSubmitted(true)
  }

  return (
    <footer className="px-6 md:px-16 pt-20 pb-10 border-t border-cream-deep bg-cream">
      <div className="grid md:grid-cols-5 gap-12 mb-16">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-light text-ink mb-4 tracking-wide">AURELE</p>
          <p className="text-sm text-ink-faint max-w-xs mb-6">
            Timeless pieces, honestly sourced. Curated watches and accessories from independent
            ateliers and heritage houses worldwide.
          </p>

          {submitted ? (
            <p className="text-sm text-gold">You're on the list — thank you.</p>
          ) : (
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join our list"
                className="flex-1 bg-cream-soft border border-cream-deep rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
              />
              <button
                onClick={handleSubscribe}
                className="px-5 py-2.5 rounded-lg text-sm bg-ink text-cream transition-calm hover:opacity-85"
              >
                Join
              </button>
            </div>
          )}
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-ink-faint mb-5">{col.heading}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-gold transition-calm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-cream-deep">
        <p className="text-xs text-ink-faint">© 2026 Aurele. All rights reserved.</p>
        {/* The small brand-tied detail: a genuinely live-ticking clock,
            since the whole brand identity is built around time. */}
        <LiveClock />
        <div className="flex gap-6">
          <Link href="/legal/terms" className="text-xs text-ink-faint hover:text-ink transition-calm">Terms</Link>
          <Link href="/legal/privacy" className="text-xs text-ink-faint hover:text-ink transition-calm">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CookieBanner({ initialConsent }: { initialConsent: string | null }) {
  const [visible, setVisible] = useState(!initialConsent)

  async function respond(value: 'accepted' | 'declined') {
    await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'cookies', value }),
    })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-ink text-cream px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-cream/85 max-w-2xl">
        This website uses one essential cookie to keep you signed in, and (if accepted) may
        use additional cookies to improve your experience.{' '}
        <Link href="/legal/cookies" className="underline text-gold">Learn more</Link>
      </p>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={() => respond('accepted')}
          className="px-6 py-2.5 rounded-full text-sm bg-gold text-ink font-medium transition-calm hover:opacity-85"
        >
          Accept
        </button>
        <button
          onClick={() => respond('declined')}
          className="px-6 py-2.5 rounded-full text-sm border border-cream/30 text-cream transition-calm hover:border-cream/60"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ACKNOWLEDGMENTS = [
  'This is a portfolio/demonstration project, not a registered commercial business.',
  'All payments currently run in Test Mode — no real money is ever charged to any card.',
  'Product data, brand names, and inventory shown are simulated for demonstration purposes.',
  'The information on this site does not constitute a real commercial offer.',
  'I am legally capable of entering a binding agreement in my jurisdiction.',
  'I have read and agree to be bound by the Terms & Conditions and Privacy Policy.',
]

export default function WelcomeGatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  async function handleAgree() {
    setLoading(true)
    await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'disclaimer' }),
    })
    const next = searchParams.get('next') || '/'
    router.push(next)
    router.refresh()
  }

  function handleDisagree() {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-cream rounded-2xl p-8 md:p-10 max-h-[85vh] overflow-y-auto">
        <div className="w-1 h-6 bg-gold mb-6" />
        <h1 className="font-display text-2xl md:text-3xl font-light text-ink mb-6">
          Disclaimer & Confirmation
        </h1>

        <p className="text-sm text-ink-soft leading-relaxed mb-4">
          Aurele is a demonstration e-commerce project built for portfolio purposes. This
          site is fully functional — including real authentication, a real database, and a
          real (test-mode) payment flow — but it is not currently operating as a live
          commercial business. No real financial transactions occur on this site in its
          current state.
        </p>

        <p className="text-sm text-ink font-medium mb-3">
          By clicking "I Agree" below, you acknowledge and confirm that:
        </p>

        <ol className="space-y-2.5 mb-8">
          {ACKNOWLEDGMENTS.map((item, i) => (
            <li key={i} className="text-sm text-ink-soft leading-relaxed flex gap-2.5">
              <span className="text-gold flex-shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>

        <p className="text-xs text-ink-faint mb-6">
          If you do not agree to the above, please click "I Disagree" to exit.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDisagree}
            className="flex-1 py-3 rounded-full border border-cream-deep text-sm text-ink transition-calm hover:border-ink-faint"
          >
            I Disagree
          </button>
          <button
            onClick={handleAgree}
            disabled={loading}
            className="flex-1 py-3 rounded-full text-sm bg-gold text-ink font-medium transition-calm hover:opacity-85 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : 'I Agree'}
          </button>
        </div>

        <p className="text-xs text-ink-faint text-center mt-5">
          By entering this website you are agreeing to our{' '}
          <a href="/legal/terms" target="_blank" className="underline">Terms</a> and{' '}
          <a href="/legal/privacy" target="_blank" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
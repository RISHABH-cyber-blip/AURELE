'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function ReferPage() {
  const [code, setCode] = useState('')
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/account/referral')
      .then((r) => r.json())
      .then((d) => {
        setCode(d.referralCode ?? '')
        setReferralCount(d.referralCount ?? 0)
      })
      .catch(() => {
        setCode('')
        setReferralCount(0)
      })
  }, [])

  const link = typeof window !== 'undefined' && code ? `${window.location.origin}/signup?ref=${code}` : ''
  const whatsappText = encodeURIComponent(`I've been using Aurele for curated watches — thought you'd like it too. Sign up here: ${link}`)

  function handleCopy() {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-xl mx-auto">
        <Link href="/account" className="text-sm text-ink-faint hover:text-gold transition-calm">← Back to Account</Link>
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mt-6 mb-3">Refer & Earn</p>
        <h1 className="font-display text-4xl font-light text-ink mb-4">Invite a Friend</h1>
        <p className="text-ink-soft font-light mb-10">
          Share your link — when a friend signs up and places their first order, you both earn
          500 points toward your next piece.
        </p>

        <div className="bg-cream-soft rounded-2xl p-7 mb-6">
          <p className="text-xs text-ink-faint uppercase tracking-wide mb-2">Your Referral Link</p>
          <div className="flex gap-2">
            <input readOnly value={link} className="flex-1 bg-cream border border-cream-deep rounded-lg px-3 py-2.5 text-sm text-ink-soft" />
            <button onClick={handleCopy} className="px-5 py-2.5 rounded-lg text-sm bg-ink text-cream transition-calm hover:opacity-85 flex-shrink-0">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center w-full py-3.5 rounded-full text-sm font-medium bg-[#25D366] text-white transition-calm hover:opacity-90 mb-8"
        >
          Invite via WhatsApp
        </a>

        <div className="bg-cream-soft rounded-2xl p-6 text-center">
          <p className="font-display text-3xl text-ink mb-1">{referralCount}</p>
          <p className="text-xs text-ink-faint uppercase tracking-wide">Friends Referred</p>
        </div>
      </main>
    </>
  )
}
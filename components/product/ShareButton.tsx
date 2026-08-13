'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export default function ShareButton({ productName, productUrl }: { productName: string; productUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = productUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url: shareUrl })
      } catch {
        // user cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      type="button"
      title="Share Product"
      className="h-12 px-4 rounded-full border border-cream-deep bg-cream-soft/60 hover:bg-gold/10 hover:border-gold hover:text-gold text-ink-soft transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-wider uppercase font-medium group shrink-0"
    >
      {copied ? (
        <>
          <Check size={16} className="text-gold" />
          <span className="text-gold font-medium">Copied</span>
        </>
      ) : (
        <>
          <Share2 size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </button>
  )
}
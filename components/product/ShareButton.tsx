'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

export default function ShareButton({ productName, productUrl }: { productName: string; productUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url: productUrl })
      } catch {
        // user cancelled — no action needed
      }
    } else {
      navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-gold transition-calm"
    >
      <Share2 size={14} strokeWidth={1.5} />
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}
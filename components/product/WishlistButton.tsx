'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/wishlist?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.saved))
  }, [productId])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    const data = await res.json()
    setSaved(data.saved)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle wishlist"
      className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-cream/90 backdrop-blur transition-calm hover:scale-110"
    >
      <Heart size={15} fill={saved ? '#B8935F' : 'none'} className={saved ? 'text-gold' : 'text-ink-faint'} strokeWidth={1.5} />
    </button>
  )
}
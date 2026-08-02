'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export default function OrderFeedbackForm({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | 'duplicate' | null>(null)

  async function handleSubmit() {
    if (rating === 0) return
    setSubmitting(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, title, body }),
    })
    setSubmitting(false)
    if (res.status === 409) setResult('duplicate')
    else if (res.ok) setResult('success')
    else setResult('error')
  }

  if (result === 'success') return <p className="text-xs text-gold mt-2">Thank you — your review is live.</p>
  if (result === 'duplicate') return <p className="text-xs text-ink-faint mt-2">You've already reviewed this piece.</p>

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-gold hover:underline mt-2">
        Give Feedback
      </button>
    )
  }

  return (
    <div className="mt-3 bg-cream-soft rounded-xl p-4">
      <p className="text-xs text-ink-faint mb-2">Rate {productName}</p>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star size={20} fill={(hoverRating || rating) >= n ? '#B8935F' : 'none'} className={(hoverRating || rating) >= n ? 'text-gold' : 'text-ink-faint'} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-gold"
      />
      <textarea
        placeholder="Your thoughts (optional)"
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-gold resize-none"
      />
      {result === 'error' && <p className="text-xs text-red-600 mb-2">Something went wrong — try again.</p>}
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={rating === 0 || submitting} className="px-5 py-2 rounded-full text-xs bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40">
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
        <button onClick={() => setOpen(false)} className="px-5 py-2 rounded-full text-xs text-ink-faint hover:text-ink transition-calm">Cancel</button>
      </div>
    </div>
  )
}
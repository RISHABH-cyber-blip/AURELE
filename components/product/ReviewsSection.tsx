'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface Props {
  productId: string
}

export default function ReviewsSection({ productId }: Props) {
  const [summary, setSummary] = useState<{ average: number; total: number; counts: Record<number, number> } | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url = `/api/reviews?productId=${productId}${filter ? `&rating=${filter}` : ''}`
    fetch(url).then((r) => r.json()).then((d) => {
      setReviews(d.reviews)
      setSummary(d.summary)
      setLoading(false)
    })
  }, [productId, filter])

  if (loading && !summary) return <p className="text-sm text-ink-faint">Loading reviews…</p>
  if (!summary || summary.total === 0) {
    return <p className="text-sm text-ink-faint">No reviews yet — be the first to share your experience.</p>
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-8">
        <div>
          <p className="font-display text-4xl text-ink">{summary.average.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={14} fill={summary.average >= n - 0.5 ? '#B8935F' : 'none'} className="text-gold" strokeWidth={1.5} />
            ))}
          </div>
          <p className="text-xs text-ink-faint mt-1">{summary.total} review{summary.total !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 max-w-xs">
          {[5, 4, 3, 2, 1].map((n) => (
            <button key={n} onClick={() => setFilter(filter === n ? null : n)} className="w-full flex items-center gap-2 text-xs mb-1 group">
              <span className={`w-8 text-right ${filter === n ? 'text-gold' : 'text-ink-faint'}`}>{n}★</span>
              <div className="flex-1 h-1.5 bg-cream-deep rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-calm ${filter === n ? 'bg-gold' : 'bg-ink-faint/50'}`}
                  style={{ width: `${summary.total > 0 ? ((summary.counts[n] ?? 0) / summary.total) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-ink-faint">{summary.counts[n] ?? 0}</span>
            </button>
          ))}
          {filter && (
            <button onClick={() => setFilter(null)} className="text-xs text-gold hover:underline mt-1">Clear filter</button>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-cream-deep">
        {reviews.map((r) => (
          <div key={r.id} className="py-5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={12} fill={r.rating >= n ? '#B8935F' : 'none'} className="text-gold" strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-xs text-ink-faint">{r.user.name || 'Verified Buyer'}</span>
            </div>
            {r.title && <p className="text-sm text-ink font-medium mb-1">{r.title}</p>}
            {r.body && <p className="text-sm text-ink-soft leading-relaxed">{r.body}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
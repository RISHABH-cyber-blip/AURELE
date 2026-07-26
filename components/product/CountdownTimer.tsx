'use client'

import { useEffect, useState } from 'react'

function getTimeParts(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return null
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { hours, minutes, seconds }
}

export default function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [parts, setParts] = useState(() => getTimeParts(endsAt))

  useEffect(() => {
    const interval = setInterval(() => setParts(getTimeParts(endsAt)), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  if (!parts) {
    return <span className="text-xs text-ink-faint">Deal Ended</span>
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1 font-mono text-sm text-gold">
      <span className="bg-ink text-cream px-1.5 py-0.5 rounded">{pad(parts.hours)}</span>:
      <span className="bg-ink text-cream px-1.5 py-0.5 rounded">{pad(parts.minutes)}</span>:
      <span className="bg-ink text-cream px-1.5 py-0.5 rounded">{pad(parts.seconds)}</span>
    </div>
  )
}
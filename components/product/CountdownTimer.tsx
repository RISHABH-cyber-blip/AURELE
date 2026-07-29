'use client'

import { useEffect, useMemo, useState } from 'react'

type ClockParts = {
  hours: number
  minutes: number
  seconds: number
}

function toParts(totalSeconds: number): ClockParts {
  const safe = Math.max(0, totalSeconds)
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export default function CountdownTimer({ endsAt }: { endsAt: string }) {
  const targetMs = useMemo(() => new Date(endsAt).getTime(), [endsAt])
  const [ready, setReady] = useState(false)
  const [nowMs, setNowMs] = useState<number | null>(null)

  useEffect(() => {
    setReady(true)

    const update = () => setNowMs(Date.now())
    update()

    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [targetMs])

  if (!ready) {
    return (
      <div className="flex items-center gap-1 font-mono text-sm text-gold">
        <span className="rounded bg-ink px-1.5 py-0.5 text-cream">--</span>:
        <span className="rounded bg-ink px-1.5 py-0.5 text-cream">--</span>:
        <span className="rounded bg-ink px-1.5 py-0.5 text-cream">--</span>
      </div>
    )
  }

  const reference = nowMs ?? targetMs
  const remaining = Math.max(0, Math.floor((targetMs - reference) / 1000))
  const parts = toParts(remaining)

  return (
    <div className="flex items-center gap-1 font-mono text-sm text-gold">
      <span className="rounded bg-ink px-1.5 py-0.5 text-cream">{pad(parts.hours)}</span>:
      <span className="rounded bg-ink px-1.5 py-0.5 text-cream">{pad(parts.minutes)}</span>:
      <span className="rounded bg-ink px-1.5 py-0.5 text-cream">{pad(parts.seconds)}</span>
    </div>
  )
}
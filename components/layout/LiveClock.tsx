'use client'

import { useEffect, useState } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null // avoid server/client mismatch on first render

  return (
    <p className="font-mono text-xs text-ink-faint/60 tracking-wide">
      Your local time — {time}
    </p>
  )
}
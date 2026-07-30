'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  src?: string | null
  alt: string
}

export default function ZoomImage({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoomActive, setZoomActive] = useState(false)
  const [bgPos, setBgPos] = useState('50% 50%')
  const hasImage = Boolean(src && src.trim())

  function handleMouseMove(e: React.MouseEvent) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setBgPos(`${x}% ${y}%`)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setZoomActive(true)}
      onMouseLeave={() => setZoomActive(false)}
      onMouseMove={handleMouseMove}
      className="relative aspect-square rounded-2xl overflow-hidden bg-cream-soft cursor-zoom-in"
    >
      {hasImage ? (
        <>
          <Image src={src!} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />

          {/* Zoomed layer — only visible on hover, follows cursor position */}
          {zoomActive && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: '220%',
                backgroundPosition: bgPos,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[3px] text-ink-faint">
          No image available
        </div>
      )}

      <span className="absolute bottom-3 right-3 text-[10px] tracking-wide uppercase text-ink-faint bg-cream/80 px-2.5 py-1 rounded-full hidden md:block">
        Hover to zoom
      </span>
    </div>
  )
}
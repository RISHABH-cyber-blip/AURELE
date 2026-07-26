'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { PROMO_BANNERS } from '@/data'

const SLIDE_DURATION = 5000

export default function PromoBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % PROMO_BANNERS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [paused, next])

  if (PROMO_BANNERS.length === 0) return null
  const slide = PROMO_BANNERS[index] ?? PROMO_BANNERS[0]
  if (!slide) return null

  return (
    <section
      className="relative h-64 md:h-80 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 flex items-center px-8 md:px-20"
          style={{ background: slide.gradient }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-mono text-xs tracking-[4px] uppercase mb-3"
              style={{ color: slide.textColor, opacity: 0.7 }}
            >
              {slide.eyebrow}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="font-display font-light mb-4"
              style={{ color: slide.textColor, fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mb-7 max-w-md font-light"
              style={{ color: slide.textColor, opacity: 0.85 }}
            >
              {slide.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}>
              <Link
                href={slide.cta.href}
                className="inline-block px-8 py-3 rounded-full text-sm tracking-wide font-medium transition-calm hover:opacity-85"
                style={{
                  background: slide.textColor,
                  color: slide.textColor === '#FAF6F0' ? '#1A1A1A' : '#FAF6F0',
                }}
              >
                {slide.cta.label}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {PROMO_BANNERS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="w-6 h-1 rounded-full transition-calm"
            style={{ background: i === index ? '#B8935F' : 'rgba(250,246,240,0.35)' }}
          />
        ))}
      </div>
    </section>
  )
}
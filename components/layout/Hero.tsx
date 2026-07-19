'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import WatchCanvas from '../three/watchCanvas'
import { HERO_STATS } from '@/data'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function Hero() {
  return (
    <section suppressHydrationWarning id="hero" className="relative min-h-screen grid md:grid-cols-2 items-center px-6 md:px-16 pt-32 pb-20">
      <div className="relative z-10 order-2 md:order-1">
        <motion.p {...fadeUp(0.1)} className="font-mono text-xs tracking-[4px] uppercase text-gold mb-6">
          The 2026 Collection
        </motion.p>

        <motion.h1
          {...fadeUp(0.25)}
          className="font-display font-light leading-[0.95] text-ink mb-8"
          style={{ fontSize: 'clamp(48px, 6.5vw, 92px)' }}
        >
          Pieces worth
          <br />
          passing down
        </motion.h1>

        <motion.p {...fadeUp(0.4)} className="text-ink-soft font-light leading-relaxed text-lg max-w-md mb-10">
          Curated watches and accessories from 128 independent ateliers and
          heritage houses — each one authenticated, none of them ordinary.
        </motion.p>

        <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-4 mb-16">
          <a href="/shop" className="px-9 py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85">
            Explore the Collection
          </a>
          <a href="/authenticity" className="px-9 py-3.5 rounded-full text-[14px] tracking-wide font-medium border border-cream-deep text-ink transition-calm hover:border-gold hover:text-gold">
            Our Authentication Process
          </a>
        </motion.div>

        <motion.div {...fadeUp(0.7)} className="flex gap-10 pt-8 border-t border-cream-deep">
          {HERO_STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-light text-ink leading-none mb-1">{s.num}</div>
              <div className="text-[11px] tracking-wide uppercase text-ink-faint">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative order-1 md:order-2 h-[380px] md:h-[560px] flex items-center justify-center"
      >
        <Suspense fallback={<div className="text-ink-faint text-sm">Loading…</div>}>
          <WatchCanvas />
        </Suspense>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-1.5 border border-cream-deep text-[11px] tracking-wide uppercase text-ink-faint font-mono">
          Drag to rotate
        </div>
      </motion.div>
    </section>
  )
}
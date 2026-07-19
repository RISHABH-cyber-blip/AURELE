'use client'

import { FEATURED_BRANDS } from '@/data'

export default function FeaturedBrands() {
  const doubled = [...FEATURED_BRANDS, ...FEATURED_BRANDS]

  return (
    <section className="border-y border-cream-deep py-10 overflow-hidden">
      <p className="text-center font-mono text-[11px] tracking-[4px] uppercase text-ink-faint mb-8">
        Trusted Houses
      </p>

      <div className="overflow-hidden">
        <div
          className="flex gap-16 whitespace-nowrap w-max"
          style={{ animation: 'brandScroll 38s linear infinite' }}
        >
          {doubled.map((name, i) => (
            <span
              key={i}
              className="font-display text-2xl md:text-3xl font-light text-ink-soft tracking-wide hover:text-gold transition-calm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes brandScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
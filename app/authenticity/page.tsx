'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const CHECKLIST_CATEGORIES = [
  {
    name: 'Movement & Mechanism',
    items: [
      'Caliber matched against manufacturer records', 'Power reserve tested under load',
      'Balance wheel amplitude measured', 'Rate accuracy checked across 6 positions',
      'Escapement inspected for wear', 'Jewel count verified against spec',
      'Winding mechanism stress-tested', 'Date-change function timed',
      'Chronograph function cycle-tested', 'Water resistance pressure-tested',
      'Movement serial cross-referenced', 'Service history reviewed',
    ],
  },
  {
    name: 'Case & Crystal',
    items: [
      'Case material composition verified', 'Crystal hardness tested',
      'Case back engravings authenticated', 'Lug width measured to spec',
      'Bezel action and click count checked', 'Crown function and threading tested',
      'Case finish inspected under magnification', 'Weight compared to factory spec',
      'Serial number laser-etch verified', 'Anti-reflective coating inspected',
      'Case dimensions measured to 0.1mm',
    ],
  },
  {
    name: 'Strap & Clasp',
    items: [
      'Material authenticity confirmed', 'Stitching pattern matched',
      'Clasp mechanism stress-tested', 'Buckle stamp verified',
      'Strap-to-lug fit checked', 'Spring bars inspected for wear',
      'Color consistency verified', 'Hardware plating tested',
      'Adjustment holes measured for spacing',
    ],
  },
  {
    name: 'Documentation & Packaging',
    items: [
      'Original box condition assessed', 'Papers cross-checked against serial',
      'Warranty card authenticity verified', 'Provenance history documented',
      'Photography completed for records', 'Final visual inspection by second reviewer',
      'Packaging integrity confirmed', 'Certificate of authenticity issued',
      'Insurance valuation completed', 'Final quality sign-off',
    ],
  },
]

function AuthenticitySeal() {
  const ref = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 200 200" className="w-40 h-40 mx-auto mb-10">
      <circle
        cx="100" cy="100" r="85" fill="none" stroke="#B8935F" strokeWidth="1.5"
        strokeDasharray="534" strokeDashoffset={visible ? 0 : 534}
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.25,0.46,0.45,0.94)' }}
      />
      <circle
        cx="100" cy="100" r="70" fill="none" stroke="#B8935F" strokeWidth="0.75"
        strokeDasharray="440" strokeDashoffset={visible ? 0 : 440}
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s' }}
      />
      <text
        x="100" y="95" textAnchor="middle" fill="#1A1A1A" fontSize="13" letterSpacing="2"
        fontFamily="var(--font-mono), monospace"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 1s' }}
      >
        42-POINT
      </text>
      <text
        x="100" y="115" textAnchor="middle" fill="#B8935F" fontSize="11" letterSpacing="3"
        fontFamily="var(--font-mono), monospace"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 1.2s' }}
      >
        VERIFIED
      </text>
    </svg>
  )
}

function ChecklistAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="max-w-2xl mx-auto">
      {CHECKLIST_CATEGORIES.map((cat, i) => (
        <div key={cat.name} className="border-b border-cream-deep">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left"
          >
            <span className="font-display text-xl font-light text-ink">{cat.name}</span>
            <span className="text-xs text-ink-faint">{cat.items.length} checks · {open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <ul className="pb-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {cat.items.map((item, j) => (
                <li
                  key={item}
                  className="text-sm text-ink-soft flex items-center gap-2"
                  style={{ animation: `fadeInItem 0.4s ease ${j * 0.03}s both` }}
                >
                  <span className="text-gold">✓</span> {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <style>{`
        @keyframes fadeInItem {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default function AuthenticityPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Our Promise</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ink mb-8">
            Every Piece, Verified
          </h1>

          <AuthenticitySeal />

          <p className="text-ink-soft font-light leading-relaxed">
            Before a single piece reaches your hands, it passes through the hands of our
            verification team — a process built not for speed, but for certainty. We built
            Aurele on the belief that trust in a timepiece isn't declared, it's earned, one
            inspection at a time. What follows is not a formality. It's the actual list our
            team works through, on every watch, every time.
          </p>
        </div>

        <ChecklistAccordion />
      </main>
      <Footer />
    </>
  )
}
'use client'

import { useState } from 'react'
import { Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react'

const CHECKLIST = [
  'Movement calibration verified',
  'Case & crystal inspected',
  'Serial number cross-checked',
  'Strap stitching quality-tested',
]

export default function TrustBar() {
  const [checkedItems, setCheckedItems] = useState<number>(0)
  const [hovering, setHovering] = useState(false)

  function startChecklist() {
    setHovering(true)
    setCheckedItems(0)
    CHECKLIST.forEach((_, i) => {
      setTimeout(() => setCheckedItems((c) => c + 1), (i + 1) * 250)
    })
  }

  return (
    <section className="px-6 md:px-16 py-16 border-y border-cream-deep">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="flex items-start gap-3">
          <Truck size={22} strokeWidth={1.5} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-ink font-medium mb-1">Free Worldwide Shipping</p>
            <p className="text-xs text-ink-faint">On every order, no minimum</p>
          </div>
        </div>

        {/* This one reveals a real animated checklist on hover — ties
            back to the "42-Pt Authenticity Check" stat in the Hero */}
        <div
          className="flex items-start gap-3 cursor-default"
          onMouseEnter={startChecklist}
          onMouseLeave={() => setHovering(false)}
        >
          <ShieldCheck size={22} strokeWidth={1.5} className="text-gold flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm text-ink font-medium mb-1">Authenticity Guaranteed</p>
            {!hovering ? (
              <p className="text-xs text-ink-faint">42-point verification, every piece</p>
            ) : (
              <ul className="space-y-1">
                {CHECKLIST.map((item, i) => (
                  <li
                    key={item}
                    className={`text-xs flex items-center gap-1.5 transition-calm ${
                      i < checkedItems ? 'text-gold' : 'text-ink-faint/40'
                    }`}
                  >
                    <span>{i < checkedItems ? '✓' : '·'}</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw size={22} strokeWidth={1.5} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-ink font-medium mb-1">30-Day Returns</p>
            <p className="text-xs text-ink-faint">No questions asked</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Lock size={22} strokeWidth={1.5} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-ink font-medium mb-1">Secure Checkout</p>
            <p className="text-xs text-ink-faint">Encrypted end to end</p>
          </div>
        </div>
      </div>
    </section>
  )
}
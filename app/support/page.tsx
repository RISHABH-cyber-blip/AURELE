'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

const FAQS = [
  { q: 'How do I know a piece is authentic?', a: 'Every watch goes through our 42-point authenticity verification before it ships — see our Authenticity page for details.' },
  { q: 'What is your return policy?', a: '30-day returns on all unworn pieces in original packaging. See our Refund Policy for full details.' },
  { q: 'How long does shipping take?', a: 'Most orders ship within 2-3 business days, with delivery times varying by destination.' },
  { q: 'Can I track my order?', a: 'Yes — once shipped, use the Track Order page with your order details, or check your Account for real-time status.' },
]

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-2xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">We're Here to Help</p>
        <h1 className="font-display text-4xl font-light text-ink mb-12">Support</h1>

        <div className="flex flex-col divide-y divide-cream-deep mb-16">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-ink font-medium">{faq.q}</span>
                <span className="text-gold text-xl">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <p className="text-sm text-ink-soft mt-3 leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>

        <div className="bg-cream-soft rounded-2xl p-7 text-center">
          <p className="text-ink mb-2">Still need help?</p>
          <p className="text-sm text-ink-faint mb-4">Our team typically responds within a few hours.</p>
          <a href="/contact" className="text-gold hover:underline text-sm">Contact Us →</a>
        </div>
      </main>
    </>
  )
}
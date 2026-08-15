'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError('Something went wrong — please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ink mb-6">Contact Us</h1>
          <p className="text-ink-soft font-light mb-10">
            Questions about a piece, an order, or anything else — we typically respond
            within a few hours.
          </p>

          <div className="flex gap-3 mb-10">
            <a href="mailto:rm1994269@gmail.com" className="px-5 py-2.5 rounded-full text-sm border border-cream-deep text-ink-soft hover:border-gold hover:text-gold transition-calm">
              rm1994269@gmail.com
            </a>
            <a href="https://wa.me/918076062578" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full text-sm border border-cream-deep text-ink-soft hover:border-gold hover:text-gold transition-calm">
              WhatsApp Us
            </a>
          </div>

          {submitted ? (
            <div className="bg-gold/10 border border-gold/30 rounded-xl px-6 py-8 text-center">
              <p className="text-ink">Message received — we'll be in touch soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
              />
              <input
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold resize-none"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.email || !form.message}
                className="px-8 py-3.5 rounded-full text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40"
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
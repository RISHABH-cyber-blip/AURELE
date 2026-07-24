'use client'

import { useState } from 'react'
import { CASE_METALS, DIAL_COLORS, STRAP_MATERIALS, SIZES, calculatePrice, type BuildConfig } from '@/lib/customize-options'
import { formatPrice, cn } from '@/lib/utils'

interface Props {
  onConfigChange: (config: BuildConfig) => void
}

export default function CustomizerPanel({ onConfigChange }: Props) {
  const [config, setConfig] = useState<BuildConfig>({
    caseMetalId: 'gold',
    dialColorId: 'black',
    strapMaterialId: 'leather',
    size: 40,
  })
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(patch: Partial<BuildConfig>) {
    const next = { ...config, ...patch }
    setConfig(next)
    onConfigChange(next)
  }

  const price = calculatePrice(config)

  async function handleSubmit() {
    if (!email) return
    setSubmitting(true)
    setError(null)

    const res = await fetch('/api/custom-build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, email, estimatedPrice: price }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      setError('Something went wrong — try again.')
    }
    setSubmitting(false)
  }

  return (
    <div>
      <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">One of One</p>
      <h1 className="font-display text-4xl md:text-5xl font-light text-ink mb-4">
        Design Your Own
      </h1>
      <p className="text-ink-soft font-light mb-10 max-w-md">
        Every choice updates the piece in real time. Build something no one
        else is wearing.
      </p>

      {/* Case Metal */}
      <div className="mb-7">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Case Metal</p>
        <div className="flex flex-wrap gap-2">
          {CASE_METALS.map((m) => (
            <button
              key={m.id}
              onClick={() => update({ caseMetalId: m.id })}
              className={cn(
                'flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-calm',
                config.caseMetalId === m.id
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              )}
            >
              <span className="w-3 h-3 rounded-full border border-ink/10" style={{ background: m.hex }} />
              {m.label}
              {m.priceModifier > 0 && <span className="text-ink-faint">+${m.priceModifier}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Dial Color */}
      <div className="mb-7">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Dial Color</p>
        <div className="flex flex-wrap gap-2">
          {DIAL_COLORS.map((d) => (
            <button
              key={d.id}
              onClick={() => update({ dialColorId: d.id })}
              className={cn(
                'flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-calm',
                config.dialColorId === d.id
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              )}
            >
              <span className="w-3 h-3 rounded-full border border-ink/10" style={{ background: d.hex }} />
              {d.label}
              {d.priceModifier > 0 && <span className="text-ink-faint">+${d.priceModifier}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Strap Material */}
      <div className="mb-7">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Strap</p>
        <div className="flex flex-wrap gap-2">
          {STRAP_MATERIALS.map((s) => (
            <button
              key={s.id}
              onClick={() => update({ strapMaterialId: s.id })}
              className={cn(
                'flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-calm',
                config.strapMaterialId === s.id
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              )}
            >
              <span className="w-3 h-3 rounded-full border border-ink/10" style={{ background: s.hex }} />
              {s.label}
              {s.priceModifier > 0 && <span className="text-ink-faint">+${s.priceModifier}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-10">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Case Size</p>
        <div className="flex gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => update({ size })}
              className={cn(
                'w-14 h-10 flex items-center justify-center text-sm rounded-full border transition-calm',
                config.size === size
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              )}
            >
              {size}mm
            </button>
          ))}
        </div>
      </div>

      {/* Price + request build */}
      <div className="pt-8 border-t border-cream-deep">
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-ink-soft">Estimated Price</span>
          <span className="font-display text-3xl text-ink">{formatPrice(price)}</span>
        </div>

        {submitted ? (
          <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-4 text-sm text-ink">
            Your build is saved. We'll reach out at <strong>{email}</strong> to bring it to life.
          </div>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-3 focus:outline-none focus:border-gold"
            />
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!email || submitting}
              className="w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40"
            >
              {submitting ? 'Saving your build…' : 'Request This Build'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
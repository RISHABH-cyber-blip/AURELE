'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getStockDisplay } from '@/lib/inventory'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'

interface Variant {
  id: string
  sku: string
  dialColor: string | null
  strapMaterial: string | null
  stockQuantity: number
  lowStockAt: number
  priceOverride: any
}

interface Props {
  variants: Variant[]
  basePrice: number
  currency: string
  productSlug: string
  productName: string
  brandName: string
  image: string
}

const STRAP_LABELS: Record<string, string> = {
  METAL: 'Metal', LEATHER: 'Leather', MESH: 'Mesh', SILICONE: 'Silicone', CERAMIC: 'Ceramic', RESIN: 'Resin',
}

export default function ProductInteractive({ variants, basePrice, currency, productSlug, productName, brandName, image }: Props) {
  const dialColors = useMemo(() => Array.from(new Set(variants.map((v) => v.dialColor).filter(Boolean))) as string[], [variants])
  const [selectedColor, setSelectedColor] = useState(dialColors[0] ?? null)

  const strapsForColor = useMemo(
    () => variants.filter((v) => v.dialColor === selectedColor).map((v) => v.strapMaterial).filter(Boolean) as string[],
    [variants, selectedColor]
  )
  const [selectedStrap, setSelectedStrap] = useState(strapsForColor[0] ?? null)

  const activeVariant = useMemo(
    () => variants.find((v) => v.dialColor === selectedColor && v.strapMaterial === selectedStrap),
    [variants, selectedColor, selectedStrap]
  )

  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  // ── Sticky bar visibility: watches whether the main Add to Cart
  // button is scrolled out of view ──
  const mainButtonRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const el = mainButtonRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Restock notify form state ──
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySubmitted, setNotifySubmitted] = useState(false)

  if (!activeVariant) return null

  const price = activeVariant.priceOverride ? Number(activeVariant.priceOverride) : basePrice
  const stock = getStockDisplay(activeVariant.stockQuantity, activeVariant.lowStockAt)

  function handleColorChange(color: string) {
    setSelectedColor(color)
    const firstStrapForColor = variants.find((v) => v.dialColor === color)?.strapMaterial ?? null
    setSelectedStrap(firstStrapForColor)
    setQty(1)
    setNotifySubmitted(false)
  }

  function handleAddToCart() {
    if (!activeVariant || stock.state === 'out-of-stock') return
    addItem(
      { variantId: activeVariant.id, productSlug, name: productName, brand: brandName, dialColor: activeVariant.dialColor ?? undefined, strapMaterial: activeVariant.strapMaterial ?? undefined, price, currency, image },
      qty
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  async function handleNotifySubmit() {
    if (!notifyEmail || !activeVariant) return
    const res = await fetch('/api/notify-restock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: notifyEmail, variantId: activeVariant.id }),
    })
    if (res.ok) setNotifySubmitted(true)
  }

  return (
    <div>
      <p className="text-2xl text-ink mb-8">{formatPrice(price, currency)}</p>

      <div className="mb-7">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">
          Dial Color — <span className="text-ink">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {dialColors.map((color) => (
            <button key={color} onClick={() => handleColorChange(color)}
              className={cn('text-sm px-4 py-2 rounded-full border transition-calm',
                selectedColor === color ? 'border-gold text-gold bg-gold/10' : 'border-cream-deep text-ink-soft hover:border-ink-faint')}>
              {color}
            </button>
          ))}
        </div>
      </div>

      {strapsForColor.length > 0 && (
        <div className="mb-7">
          <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Strap</p>
          <div className="flex flex-wrap gap-2">
            {strapsForColor.map((strap) => (
              <button key={strap} onClick={() => { setSelectedStrap(strap); setQty(1); setNotifySubmitted(false) }}
                className={cn('text-sm px-4 py-2 rounded-full border transition-calm',
                  selectedStrap === strap ? 'border-gold text-gold bg-gold/10' : 'border-cream-deep text-ink-soft hover:border-ink-faint')}>
                {STRAP_LABELS[strap] ?? strap}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-7">
        {stock.state === 'in-stock' && <p className="text-sm text-ink-soft">In Stock</p>}
        {stock.state === 'low-stock' && <p className="text-sm text-gold">Only {stock.remaining} left — order soon</p>}
        {stock.state === 'out-of-stock' && <p className="text-sm text-ink-faint">Out of Stock</p>}
      </div>

      {/* Main add-to-cart block — tracked by the sticky bar's observer */}
      <div ref={mainButtonRef} className="flex items-center gap-4">
        <div className="flex items-center border border-cream-deep rounded-full overflow-hidden">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm">−</button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(activeVariant.stockQuantity, q + 1))} disabled={qty >= activeVariant.stockQuantity}
            className="w-10 h-10 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm disabled:opacity-30">+</button>
        </div>

        <button onClick={handleAddToCart} disabled={stock.state === 'out-of-stock'}
          className={cn('flex-1 py-3.5 rounded-full text-[14px] tracking-wide font-medium transition-calm',
            stock.state === 'out-of-stock' ? 'bg-cream-deep text-ink-faint cursor-not-allowed'
            : justAdded ? 'bg-gold text-ink' : 'bg-ink text-cream hover:opacity-85')}>
          {stock.state === 'out-of-stock' ? 'Out of Stock' : justAdded ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>

      {/* SURPRISE FEATURE: real restock notification, only shown when actually out of stock */}
      {stock.state === 'out-of-stock' && (
        <div className="mt-6 bg-cream-soft rounded-xl p-5">
          {notifySubmitted ? (
            <p className="text-sm text-ink">You'll hear from us the moment this is back — thank you.</p>
          ) : (
            <>
              <p className="text-sm text-ink mb-3">Notify me when this is back in stock</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-cream border border-cream-deep rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                />
                <button onClick={handleNotifySubmit} disabled={!notifyEmail}
                  className="px-5 py-2.5 rounded-lg text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40">
                  Notify Me
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Sticky bar — appears once the main button scrolls out of view */}
      <div className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-cream border-t border-cream-deep px-6 py-4 flex items-center justify-between gap-4 transition-calm',
        showSticky ? 'translate-y-0' : 'translate-y-full'
      )}>
        <div className="min-w-0">
          <p className="text-sm text-ink truncate">{productName}</p>
          <p className="text-xs text-ink-faint">{formatPrice(price, currency)} · {selectedColor}</p>
        </div>
        <button onClick={handleAddToCart} disabled={stock.state === 'out-of-stock'}
          className={cn('flex-shrink-0 px-7 py-2.5 rounded-full text-[13px] tracking-wide font-medium transition-calm',
            stock.state === 'out-of-stock' ? 'bg-cream-deep text-ink-faint cursor-not-allowed'
            : justAdded ? 'bg-gold text-ink' : 'bg-ink text-cream hover:opacity-85')}>
          {stock.state === 'out-of-stock' ? 'Sold Out' : justAdded ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
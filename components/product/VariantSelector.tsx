'use client'

import { useMemo, useState } from 'react'
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
  priceOverride: any // Prisma Decimal | null
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
  METAL: 'Metal',
  LEATHER: 'Leather',
  MESH: 'Mesh',
  SILICONE: 'Silicone',
  CERAMIC: 'Ceramic',
  RESIN: 'Resin',
}

export default function VariantSelector({
  variants,
  basePrice,
  currency,
  productSlug,
  productName,
  brandName,
  image,
}: Props) {
  const dialColors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.dialColor).filter(Boolean))) as string[],
    [variants]
  )
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

  if (!activeVariant) return null

  const price = activeVariant.priceOverride ? Number(activeVariant.priceOverride) : basePrice
  const stock = getStockDisplay(activeVariant.stockQuantity, activeVariant.lowStockAt)

  function handleColorChange(color: string) {
    setSelectedColor(color)
    const firstStrapForColor = variants.find((v) => v.dialColor === color)?.strapMaterial ?? null
    setSelectedStrap(firstStrapForColor)
    setQty(1)
  }

  function handleAddToCart() {
    if (!activeVariant || stock.state === 'out-of-stock') return
    addItem(
      {
        variantId: activeVariant.id,
        productSlug,
        name: productName,
        brand: brandName,
        dialColor: activeVariant.dialColor ?? undefined,
        strapMaterial: activeVariant.strapMaterial ?? undefined,
        price,
        currency,
        image,
      },
      qty
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div>
      <p className="text-2xl text-ink mb-8">{formatPrice(price, currency)}</p>

      {/* Dial color picker */}
      <div className="mb-7">
        <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">
          Dial Color — <span className="text-ink">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {dialColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={cn(
                'text-sm px-4 py-2 rounded-full border transition-calm',
                selectedColor === color
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Strap picker */}
      {strapsForColor.length > 0 && (
        <div className="mb-7">
          <p className="text-xs tracking-wide uppercase text-ink-faint mb-3">Strap</p>
          <div className="flex flex-wrap gap-2">
            {strapsForColor.map((strap) => (
              <button
                key={strap}
                onClick={() => { setSelectedStrap(strap); setQty(1) }}
                className={cn(
                  'text-sm px-4 py-2 rounded-full border transition-calm',
                  selectedStrap === strap
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-cream-deep text-ink-soft hover:border-ink-faint'
                )}
              >
                {STRAP_LABELS[strap] ?? strap}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock state */}
      <div className="mb-7">
        {stock.state === 'in-stock' && <p className="text-sm text-ink-soft">In Stock</p>}
        {stock.state === 'low-stock' && (
          <p className="text-sm text-gold">Only {stock.remaining} left — order soon</p>
        )}
        {stock.state === 'out-of-stock' && <p className="text-sm text-ink-faint">Out of Stock</p>}
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-cream-deep rounded-full overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(activeVariant.stockQuantity, q + 1))}
            disabled={qty >= activeVariant.stockQuantity}
            className="w-10 h-10 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm disabled:opacity-30"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={stock.state === 'out-of-stock'}
          className={cn(
            'flex-1 py-3.5 rounded-full text-[14px] tracking-wide font-medium transition-calm',
            stock.state === 'out-of-stock'
              ? 'bg-cream-deep text-ink-faint cursor-not-allowed'
              : justAdded
              ? 'bg-gold text-ink'
              : 'bg-ink text-cream hover:opacity-85'
          )}
        >
          {stock.state === 'out-of-stock' ? 'Out of Stock' : justAdded ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatRelativeTime } from '@/lib/utils'

interface Props {
  product: {
    slug: string
    name: string
    basePrice: any
    createdAt?: string | Date
    brand: { name: string }
    images: { url: string; altText: string | null }[]
    variants: { dialColor: string | null; stockQuantity: number }[]
  }
  showNewBadge?: boolean
}

export default function ProductCard({ product, showNewBadge = false }: Props) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
  const colorCount = new Set(product.variants.map((v) => v.dialColor).filter(Boolean)).size
  const price = Number(product.basePrice)

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-soft mb-4">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText ?? product.name}
            fill
            className="object-cover transition-calm group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {totalStock === 0 && (
          <span className="absolute top-3 left-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-ink/85 text-cream">
            Sold Out
          </span>
        )}
        {showNewBadge && product.createdAt && (
          <span className="absolute top-3 right-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-cream/90 text-ink-soft backdrop-blur">
            {formatRelativeTime(new Date(product.createdAt))}
          </span>
        )}
      </div>
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-ink-faint mb-1">{product.brand.name}</p>
      <h3 className="font-display text-lg text-ink mb-1 group-hover:text-gold transition-calm">{product.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">{formatPrice(price)}</span>
        {colorCount > 1 && <span className="text-xs text-ink-faint">{colorCount} colors</span>}
      </div>
    </Link>
  )
}
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface Props {
  product: {
    slug: string
    name: string
    basePrice: any // Prisma Decimal — converted with Number() below
    brand: { name: string }
    images: { url: string; altText: string | null }[]
    variants: { dialColor: string | null; stockQuantity: number }[]
  }
}

export default function ProductCard({ product }: Props) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
  const colorCount = new Set(product.variants.map((v) => v.dialColor).filter(Boolean)).size
  const price = Number(product.basePrice)

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div suppressHydrationWarning className="relative aspect-square rounded-2xl overflow-hidden bg-cream-soft mb-4">
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
      </div>
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-ink-faint mb-1">
        {product.brand.name}
      </p>
      <h3 className="font-display text-lg text-ink mb-1 group-hover:text-gold transition-calm">
        {product.name}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">{formatPrice(price)}</span>
        {colorCount > 1 && <span className="text-xs text-ink-faint">{colorCount} colors</span>}
      </div>
    </Link>
  )
}

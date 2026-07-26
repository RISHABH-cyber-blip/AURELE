import { getActiveDeals } from '@/lib/deals'
import CountdownTimer from '@/components/product/CountdownTimer'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export default async function HourglassEdit() {
  const deals = await getActiveDeals()

  if (deals.length === 0) return null // section disappears cleanly when nothing's active

  return (
    <section className="px-6 md:px-16 section-padding">
      <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Limited Time</p>
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-12">The Hourglass Edit</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const product = deal.product
          const originalPrice = Number(product.basePrice)
          const dealPrice = originalPrice * (1 - deal.discountPct / 100)
          const image = product.images[0]?.url

          return (
            <Link
              key={deal.id}
              href={`/product/${product.slug}`}
              className="group rounded-2xl overflow-hidden border border-cream-deep transition-calm hover:border-gold"
            >
              <div className="relative aspect-square bg-cream-soft">
                {image && (
                  <Image src={image} alt={product.name} fill className="object-cover transition-calm group-hover:scale-[1.04]" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
                <span className="absolute top-3 left-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-gold text-ink font-medium">
                  {deal.discountPct}% Off
                </span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-ink-faint mb-1">{product.brand.name}</p>
                <h3 className="font-display text-lg text-ink mb-3 group-hover:text-gold transition-calm">{product.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg text-ink">{formatPrice(dealPrice)}</span>
                  <span className="text-sm text-ink-faint line-through">{formatPrice(originalPrice)}</span>
                </div>
                <CountdownTimer endsAt={deal.endsAt.toISOString()} />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}s
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecentlyViewed, type RecentlyViewedItem } from '@/lib/recently-viewed'
import { formatPrice } from '@/lib/utils'

export default function RecentlyViewedStrip({ excludeSlug }: { excludeSlug: string }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    setItems(getRecentlyViewed().filter((i) => i.slug !== excludeSlug))
  }, [excludeSlug])

  if (items.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-cream-deep">
      <p className="font-mono text-xs tracking-[4px] uppercase text-ink-faint mb-6">
        Recently Viewed
      </p>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/product/${item.slug}`}
            className="flex-shrink-0 w-40 group"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-soft mb-2">
              <Image src={item.image} alt={item.name} fill className="object-cover transition-calm group-hover:scale-105" sizes="160px" />
            </div>
            <p className="text-xs text-ink-soft truncate group-hover:text-gold transition-calm">{item.name}</p>
            <p className="text-xs text-ink-faint">{formatPrice(item.price, item.currency)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
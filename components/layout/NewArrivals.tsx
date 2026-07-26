'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

const TABS = [
  { label: 'All', value: '' },
  { label: "Men's", value: 'mens' },
  { label: "Women's", value: 'womens' },
  { label: 'Unisex', value: 'unisex' },
]

export default function NewArrivals() {
  const [active, setActive] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/new-arrivals?category=${active}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false))
  }, [active])

  return (
    <section className="px-6 md:px-16 section-padding bg-cream-soft">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Fresh In</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-ink">New Arrivals</h2>
        </div>

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className={`text-sm px-4 py-2 rounded-full border transition-calm ${
                active === tab.value ? 'border-gold text-gold bg-gold/10' : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-ink-faint text-sm">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
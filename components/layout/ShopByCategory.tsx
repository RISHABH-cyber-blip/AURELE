import Link from 'next/link'
import { getCategoryCounts } from '@/lib/products'

export default async function ShopByCategory() {
  const categories = await getCategoryCounts()

  return (
    <section className="px-6 md:px-16 section-padding">
      <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Explore</p>
      <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-12">Shop by Category</h2>

      <div className="grid md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-soft flex flex-col justify-end p-8 transition-calm hover:bg-cream-deep"
          >
            <h3 className="font-display text-3xl font-light text-ink mb-2 group-hover:text-gold transition-calm">
              {cat.name}
            </h3>
            {/* Real live count from the database — not a placeholder number */}
            <p className="text-sm text-ink-faint">{cat.count} pieces</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
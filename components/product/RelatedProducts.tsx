import ProductCard from '@/components/product/ProductCard'

interface Props {
  products: any[]
  brandName: string
}

export default function RelatedProducts({ products, brandName }: Props) {
  if (products.length === 0) return null

  return (
    <section className="mt-24 pt-16 border-t border-cream-deep">
      <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">
        More from {brandName}
      </p>
      <h2 className="font-display text-3xl font-light text-ink mb-10">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
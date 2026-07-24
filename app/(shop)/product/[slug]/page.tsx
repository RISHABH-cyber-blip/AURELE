import { notFound } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import VariantSelector from '@/components/product/VariantSelector'
import RelatedProducts from '@/components/product/RelatedProducts'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(product.brandId, product.id)
  const mainImage = product.images[0]?.url

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-soft">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.images[0]?.altText ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          {/* Details */}
          <div>
            <p className="font-mono text-xs tracking-[3px] uppercase text-ink-faint mb-2">
              {product.brand.name}
            </p>
            <h1 className="font-display text-4xl font-light text-ink mb-5">{product.name}</h1>
            <p className="text-ink-soft font-light leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            <VariantSelector
              variants={product.variants}
              basePrice={Number(product.basePrice)}
              currency={product.currency}
              productSlug={product.slug}
              productName={product.name}
              brandName={product.brand.name}
              image={mainImage ?? ''}
            />

            <div className="mt-10 pt-8 border-t border-cream-deep space-y-2 text-sm text-ink-faint">
              <p>Free shipping on all orders</p>
              <p>30-day returns</p>
              <p>Authenticity guaranteed — see our verification process</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <RelatedProducts products={related} brandName={product.brand.name} />
        </div>
      </main>
    </>
  )
}
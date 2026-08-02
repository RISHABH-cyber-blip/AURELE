import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import ProductInteractive from '@/components/product/ProductInteractive'
import RelatedProducts from '@/components/product/RelatedProducts'
import RecentlyViewedStrip from '@/components/product/RecentlyViewedStrip'
import TrackView from '@/components/product/TrackView'
import ZoomImage from '@/components/product/ZoomImage'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'\
import ReviewsSection from '@/components/product/ReviewsSection'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.brandId, product.id)
  const mainImage = product.images[0]?.url ?? ''

  return (
    <>
      <Navbar />
      <TrackView
        item={{
          slug: product.slug,
          name: product.name,
          brand: product.brand.name,
          price: Number(product.basePrice),
          currency: product.currency,
          image: mainImage,
        }}
      />

      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-6xl mx-auto">
          <ZoomImage src={mainImage} alt={product.images[0]?.altText ?? product.name} />

          <div>
            <p className="font-mono text-xs tracking-[3px] uppercase text-ink-faint mb-2">{product.brand.name}</p>
            <h1 className="font-display text-4xl font-light text-ink mb-5">{product.name}</h1>
            <p className="text-ink-soft font-light leading-relaxed mb-8 max-w-md">{product.description}</p>

            <ProductInteractive
              variants={product.variants}
              basePrice={Number(product.basePrice)}
              currency={product.currency}
              productSlug={product.slug}
              productName={product.name}
              brandName={product.brand.name}
              image={mainImage}
            />

            <div className="mt-10 pt-8 border-t border-cream-deep space-y-2 text-sm text-ink-faint">
              <p>Free shipping on all orders</p>
              <p>30-day returns</p>
              <p>Authenticity guaranteed — see our verification process</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <section className="mt-24 pt-16 border-t border-cream-deep">
            <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Reviews</p>
            <h2 className="font-display text-3xl font-light text-ink mb-10">What People Are Saying</h2>
            <ReviewsSection productId={product.id} />
          </section>

          <RelatedProducts products={related} brandName={product.brand.name} />
          <RecentlyViewedStrip excludeSlug={product.slug} />
        </div>
      </main>
    </>
  )
}
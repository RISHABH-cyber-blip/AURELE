import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProductCard from '@/components/product/ProductCard'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function WishlistPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const items = await prisma.wishlistItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { brand: true, images: { orderBy: { position: 'asc' }, take: 1 }, variants: { select: { dialColor: true, stockQuantity: true } } },
  })

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Saved</p>
        <h1 className="font-display text-4xl font-light text-ink mb-12">Your Wishlist</h1>

        {products.length === 0 ? (
          <div className="py-20 text-center bg-cream-soft rounded-2xl">
            <p className="text-ink-soft mb-4">Nothing saved yet.</p>
            <Link href="/shop" className="text-gold hover:underline text-sm">Explore the Collection →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
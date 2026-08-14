import Link from 'next/link'
import Image from 'next/image'
import { getAdminProducts } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
    const products = await getAdminProducts()

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-light text-ink">Products</h1>
                <Link href="/admin/products/new" className="px-5 py-2.5 rounded-full text-sm bg-ink text-cream transition-calm hover:opacity-85">
                    + Add Product
                </Link>
            </div>

            <div className="bg-cream-soft rounded-2xl overflow-hidden">
                {products.map((p) => {
                    const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
                    return (
                        <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center gap-4 px-5 py-3.5 border-b border-cream-deep last:border-0 hover:bg-cream-deep/30 transition-calm">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                                {p.images[0] && <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="48px" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-ink truncate">{p.name}</p>
                                <p className="text-xs text-ink-faint">{p.brand.name} · {p.category.name}</p>
                            </div>
                            <span className="text-sm text-ink-soft flex-shrink-0">{formatPrice(Number(p.basePrice))}</span>
                            <span className={`text-xs flex-shrink-0 ${totalStock === 0 ? 'text-red-500' : totalStock <= 5 ? 'text-gold' : 'text-ink-faint'}`}>
                                {totalStock} in stock
                            </span>
                            {!p.isPublished && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-ink/10 text-ink-faint flex-shrink-0">Draft</span>}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
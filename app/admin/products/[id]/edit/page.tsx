import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { getAdminProduct } from '@/lib/admin-data'
import { prisma } from '@/lib/prisma'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [product, brands, categories] = await Promise.all([
        getAdminProduct(id),
        prisma.brand.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany(),
    ])

    if (!product) notFound()

    return (
        <div>
            <h1 className="font-display text-3xl font-light text-ink mb-8">Edit {product.name}</h1>
            <ProductForm
                brands={JSON.parse(JSON.stringify(brands))}
                categories={JSON.parse(JSON.stringify(categories))}
                product={{ ...product, variants: product.variants }}
            />
        </div>
    )
}
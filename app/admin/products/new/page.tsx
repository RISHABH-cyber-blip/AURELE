import ProductForm from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export default async function NewProductPage() {
    const [brands, categories] = await Promise.all([
        prisma.brand.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany(),
    ])

    return (
        <div>
            <h1 className="font-display text-3xl font-light text-ink mb-8">Add Product</h1>
            <ProductForm brands={brands} categories={categories} />
        </div>
    )
}
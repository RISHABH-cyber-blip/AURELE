import DealsManager from '@/components/admin/DealsManager'
import { getAdminDeals } from '@/lib/admin-data'
import { prisma } from '@/lib/prisma'

export default async function AdminDealsPage() {
    const [deals, products] = await Promise.all([
        getAdminDeals(),
        prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' }, take: 200 }),
    ])

    return (
        <div>
            <h1 className="font-display text-3xl font-light text-ink mb-8">The Hourglass Edit — Deals</h1>
            <DealsManager deals={deals} products={JSON.parse(JSON.stringify(products))} />
        </div>
    )
}
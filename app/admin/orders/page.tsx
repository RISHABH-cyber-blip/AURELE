import Link from 'next/link'
import OrderRow from '@/components/admin/OrderRow'
import { getAdminOrders } from '@/lib/admin-data'

const FILTERS = ['', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status } = await searchParams
    const orders = await getAdminOrders(status)

    return (
        <div>
            <h1 className="font-display text-3xl font-light text-ink mb-6">Orders</h1>

            <div className="flex gap-2 mb-6">
                {FILTERS.map((f) => (
                    <Link
                        key={f}
                        href={f ? `/admin/orders?status=${f}` : '/admin/orders'}
                        className={`px-4 py-2 rounded-full text-xs border transition-calm ${status === f || (!status && !f) ? 'border-gold text-gold bg-gold/10' : 'border-cream-deep text-ink-soft'}`}
                    >
                        {f || 'All'}
                    </Link>
                ))}
            </div>

            <div className="bg-cream-soft rounded-2xl overflow-hidden">
                {orders.length === 0 ? (
                    <p className="p-6 text-sm text-ink-faint">No orders found.</p>
                ) : (
                    orders.map((o) => <OrderRow key={o.id} order={o} />)
                )}
            </div>
        </div>
    )
}
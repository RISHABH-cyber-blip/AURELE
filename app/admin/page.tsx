import Link from 'next/link'
import { getAdminDashboardStats } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
    const stats = await getAdminDashboardStats()

    return (
        <div>
            <h1 className="font-display text-3xl font-light text-ink mb-8">Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-cream-soft rounded-2xl p-6">
                    <p className="font-display text-3xl text-ink mb-1">{stats.totalProducts}</p>
                    <p className="text-xs text-ink-faint uppercase tracking-wide">Products</p>
                </div>
                <div className="bg-cream-soft rounded-2xl p-6">
                    <p className="font-display text-3xl text-ink mb-1">{stats.totalOrders}</p>
                    <p className="text-xs text-ink-faint uppercase tracking-wide">Total Orders</p>
                </div>
                <div className="bg-cream-soft rounded-2xl p-6">
                    <p className="font-display text-3xl text-ink mb-1">{stats.pendingOrders}</p>
                    <p className="text-xs text-ink-faint uppercase tracking-wide">Needs Attention</p>
                </div>
                <div className="bg-cream-soft rounded-2xl p-6">
                    <p className="font-display text-3xl text-ink mb-1">{formatPrice(stats.totalRevenue)}</p>
                    <p className="text-xs text-ink-faint uppercase tracking-wide">Revenue</p>
                </div>
            </div>

            {/* Low stock — real, computed from actual inventory */}
            <div className="bg-cream-soft rounded-2xl p-7">
                <h2 className="font-display text-xl font-light text-ink mb-5">Low Stock Alerts</h2>
                {stats.lowStockVariants.length === 0 ? (
                    <p className="text-sm text-ink-faint">Nothing running low right now.</p>
                ) : (
                    <div className="flex flex-col divide-y divide-cream-deep">
                        {stats.lowStockVariants.map((v) => (
                            <Link key={v.id} href={`/admin/products/${v.productId}/edit`} className="flex items-center justify-between py-3 hover:text-gold transition-calm">
                                <div>
                                    <p className="text-sm text-ink">{v.product.name}</p>
                                    <p className="text-xs text-ink-faint">{v.dialColor} · {v.strapMaterial}</p>
                                </div>
                                <span className="text-xs text-gold font-medium">{v.stockQuantity} left</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
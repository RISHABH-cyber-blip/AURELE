import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { getCurrentUser } from '@/lib/auth'
import { getAccountStats, getOrderHistory } from '@/lib/account'
import { formatPrice } from '@/lib/utils'
import LogoutButton from '@/components/account/LogOutButton'

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [stats, orders] = await Promise.all([
    getAccountStats(user.id),
    getOrderHistory(user.id),
  ])

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Your Account</p>
            <h1 className="font-display text-4xl font-light text-ink">{user.name || user.email}</h1>
            <p className="text-sm text-ink-faint mt-1">Member since {memberSince}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Real stats, computed from actual orders — not placeholder numbers */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          <div className="bg-cream-soft rounded-2xl p-6 text-center">
            <p className="font-display text-3xl text-ink mb-1">{stats.totalOrders}</p>
            <p className="text-xs text-ink-faint uppercase tracking-wide">Orders Placed</p>
          </div>
          <div className="bg-cream-soft rounded-2xl p-6 text-center">
            <p className="font-display text-3xl text-ink mb-1">{formatPrice(stats.totalSpent)}</p>
            <p className="text-xs text-ink-faint uppercase tracking-wide">Lifetime Spend</p>
          </div>
          <div className="bg-cream-soft rounded-2xl p-6 text-center">
            <p className="font-display text-3xl text-ink mb-1">{stats.inProgress}</p>
            <p className="text-xs text-ink-faint uppercase tracking-wide">In Progress</p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-light text-ink mb-6">Order History</h2>

        {orders.length === 0 ? (
          <div className="py-16 text-center bg-cream-soft rounded-2xl">
            <p className="text-ink-soft mb-4">No orders yet.</p>
            <Link href="/shop" className="text-gold hover:underline text-sm">Start Shopping →</Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-cream-deep">
            {orders.map((order) => (
              <div key={order.id} className="py-6 flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center min-w-0">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cream bg-cream-soft">
                        {item.variant.product.images[0] && (
                          <Image src={item.variant.product.images[0].url} alt="" fill className="object-cover" sizes="48px" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    <p className="text-xs text-ink-faint">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-ink">{formatPrice(Number(order.total), order.currency)}</p>
                  <span className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full bg-gold/10 text-gold">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import OrderStatusTimeline from '@/components/account/OrderStatusTimeline'
import { getCurrentUser } from '@/lib/auth'
import { getOrderHistory } from '@/lib/account'
import { formatPrice } from '@/lib/utils'

export default async function TrackOrderPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const orders = await getOrderHistory(user.id)
  // Only orders that actually went through checkout are worth tracking
  const trackableOrders = orders.filter((o) => o.status !== 'PENDING')

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Order Status</p>
        <h1 className="font-display text-4xl font-light text-ink mb-12">Track Your Orders</h1>

        {trackableOrders.length === 0 ? (
          <div className="py-16 text-center bg-cream-soft rounded-2xl">
            <p className="text-ink-soft mb-4">No orders to track yet.</p>
            <Link href="/shop" className="text-gold hover:underline text-sm">Start Shopping →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {trackableOrders.map((order) => (
              <div key={order.id} className="bg-cream border border-cream-deep rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-ink-faint">
                      Order placed {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-ink font-medium mt-0.5">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className="text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                    {order.status}
                  </span>
                </div>

                <OrderStatusTimeline status={order.status} createdAt={order.createdAt} />

                {order.trackingNumber && (
                  <div className="mt-6 pt-5 border-t border-cream-deep flex items-center justify-between text-sm">
                    <span className="text-ink-faint">Tracking Number</span>
                    <span className="text-ink font-mono">{order.trackingNumber} {order.carrier ? `(${order.carrier})` : ''}</span>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-cream-deep flex gap-4 overflow-x-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream-soft flex-shrink-0">
                      {item.variant.product.images[0] && (
                        <Image src={item.variant.product.images[0].url} alt="" fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-ink-faint">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  <span className="text-sm text-ink">{formatPrice(Number(order.total), order.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import OrderStatusTimeline from '@/components/account/OrderStatusTimeline'
import OrderFeedbackForm from '@/components/account/OrderFeedbackForm'
import { getCurrentUser } from '@/lib/auth'
import { getOrderHistory } from '@/lib/account'
import { formatPrice } from '@/lib/utils'

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const orders = await getOrderHistory(user.id)
  const trackable = orders.filter((o) => o.status !== 'PENDING' && o.status !== 'CANCELLED')

  const processing = trackable.filter((o) => o.status !== 'DELIVERED')
  const completed = trackable.filter((o) => o.status === 'DELIVERED')

  const renderOrderCard = (order: (typeof orders)[number], allowFeedback: boolean) => (
    <div key={order.id} className="bg-cream border border-cream-deep rounded-2xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <p className="text-xs text-ink-faint">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="text-sm text-ink font-medium">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <span className="text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold">{order.status}</span>
      </div>

      <OrderStatusTimeline status={order.status} createdAt={order.createdAt} />

      <div className="mt-6 pt-5 border-t border-cream-deep flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream-soft flex-shrink-0">
              {item.variant.product.images[0] && (
                <Image src={item.variant.product.images[0].url} alt="" fill className="object-cover" sizes="56px" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink">{item.variant.product.name}</p>
              <p className="text-xs text-ink-faint">Qty {item.quantity} · {formatPrice(Number(item.priceAtPurchase))}</p>
              {allowFeedback && (
                <OrderFeedbackForm productId={item.variant.productId} productName={item.variant.product.name} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Your Orders</p>
        <h1 className="font-display text-4xl font-light text-ink mb-12">All Orders</h1>

        {trackable.length === 0 ? (
          <div className="py-16 text-center bg-cream-soft rounded-2xl">
            <p className="text-ink-soft">No orders yet.</p>
          </div>
        ) : (
          <>
            {processing.length > 0 && (
              <div className="mb-16">
                <h2 className="font-display text-2xl font-light text-ink mb-6">Processing</h2>
                <div className="flex flex-col gap-6">{processing.map((o) => renderOrderCard(o, true))}</div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-light text-ink mb-6">Completed</h2>
                <div className="flex flex-col gap-6">{completed.map((o) => renderOrderCard(o, true))}</div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
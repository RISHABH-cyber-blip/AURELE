import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { decrementStock } from '@/lib/inventory'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    // Verifies this request genuinely came from Stripe — not a forged
    // request pretending payment succeeded.
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (order && order.status === 'PENDING') {
        // Decrement stock for each item using the atomic helper — if two
        // people somehow both paid for the last unit (shouldn't happen
        // since Stripe processes payments sequentially per item, but we
        // stay safe regardless), this correctly lets only one succeed.
        for (const item of order.items) {
          const ok = await decrementStock(item.variantId, item.quantity)
          if (!ok) {
            console.error(`Stock decrement failed for variant ${item.variantId} on order ${orderId} — needs manual review.`)
          }
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent as string,
          },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
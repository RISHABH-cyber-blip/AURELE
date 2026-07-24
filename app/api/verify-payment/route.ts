import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { decrementStock } from '@/lib/inventory'

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = await request.json()

  // Razorpay signs every successful payment with your secret key. Recomputing
  // that signature ourselves and comparing is what proves this request
  // genuinely came from a real completed payment — not someone just calling
  // this endpoint claiming they paid.
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: internalOrderId },
    include: { items: true },
  })

  if (!order || order.status !== 'PENDING') {
    return NextResponse.json({ error: 'Order not found or already processed.' }, { status: 400 })
  }

  // Atomic decrement — same safety guarantee as before, prevents overselling
  for (const item of order.items) {
    const ok = await decrementStock(item.variantId, item.quantity)
    if (!ok) {
      console.error(`Stock decrement failed for variant ${item.variantId} on order ${order.id} — needs manual review.`)
    }
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID', stripePaymentIntentId: razorpay_payment_id },
  })

  return NextResponse.json({ success: true })
}
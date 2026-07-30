import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { decrementStock } from '@/lib/inventory'

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = await request.json()

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

  // NEW: 1 loyalty point per ₹100 spent — only for logged-in orders
  if (order.userId) {
    const pointsEarned = Math.floor(Number(order.total) / 100)
    await prisma.user.update({
      where: { id: order.userId },
      data: { loyaltyPoints: { increment: pointsEarned } },
    })
  }

  return NextResponse.json({ success: true })
}
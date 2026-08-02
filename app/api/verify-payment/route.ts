import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { decrementStock } from '@/lib/inventory'
import { REFERRAL_REWARD_POINTS } from '@/lib/referral'

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = await request.json()

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: internalOrderId }, include: { items: true } })
  if (!order || order.status !== 'PENDING') {
    return NextResponse.json({ error: 'Order not found or already processed.' }, { status: 400 })
  }

  // Check for prior paid orders BEFORE marking this one paid — determines
  // if this is genuinely the buyer's first purchase (for referral reward).
  let priorPaidCount = 0
  if (order.userId) {
    priorPaidCount = await prisma.order.count({
      where: { userId: order.userId, status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
    })
  }

  for (const item of order.items) {
    const ok = await decrementStock(item.variantId, item.quantity)
    if (!ok) console.error(`Stock decrement failed for variant ${item.variantId} on order ${order.id}`)
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID', stripePaymentIntentId: razorpay_payment_id },
  })

  if (order.userId) {
    const pointsEarned = Math.floor(Number(order.total) / 100)
    const buyer = await prisma.user.update({
      where: { id: order.userId },
      data: { loyaltyPoints: { increment: pointsEarned } },
      select: {
        id: true,
        email: true,
        supabaseId: true,
        name: true,
        createdAt: true,
        phone: true,
        avatarUrl: true,
        loyaltyPoints: true,
        referralCode: true,
        referredById: true,
      },
    })

    // First-ever paid order + was referred by someone → reward the referrer
    if (priorPaidCount === 0 && buyer.referredById) {
      await prisma.user.update({
        where: { id: buyer.referredById },
        data: { loyaltyPoints: { increment: REFERRAL_REWARD_POINTS } },
      })
    }
  }

  return NextResponse.json({ success: true })
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { razorpay } from '@/lib/razorpay'

interface CheckoutItem {
  variantId: string
  qty: number
}

export async function POST(request: Request) {
  try {
    const { items, guestEmail }: { items: CheckoutItem[]; guestEmail?: string } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }

    // Real price + stock come from the database — never from the browser.
    // Stops someone editing the request to pay less than the real price.
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) } },
      include: { product: true },
    })

    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId)
      if (!variant) {
        return NextResponse.json({ error: 'Item not found.' }, { status: 400 })
      }
      if (variant.stockQuantity < item.qty) {
        return NextResponse.json(
          { error: `"${variant.product.name}" only has ${variant.stockQuantity} left in stock.` },
          { status: 400 }
        )
      }

      const price = variant.priceOverride ? Number(variant.priceOverride) : Number(variant.product.basePrice)
      subtotal += price * item.qty
      orderItemsData.push({ variantId: variant.id, quantity: item.qty, priceAtPurchase: price })
    }

    // Create our own order record as PENDING first
    const order = await prisma.order.create({
      data: {
        guestEmail: guestEmail || null,
        status: 'PENDING',
        subtotal,
        total: subtotal,
        currency: 'INR', // demo simplification — see note in chat about Razorpay's default test currency
        items: { create: orderItemsData },
      },
    })

    // Razorpay wants the amount in the smallest currency unit (paise for INR)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(subtotal * 100),
      currency: 'INR',
      receipt: order.id,
      notes: { internalOrderId: order.id },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: razorpayOrder.id }, // reusing this field to store Razorpay's order id
    })

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      internalOrderId: order.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Something went wrong creating your order.' }, { status: 500 })
  }
}
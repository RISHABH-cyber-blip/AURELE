import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

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

    // Look up the REAL data for every item — price and stock come from
    // the database, never from what the browser sent us. This is what
    // stops someone from editing the page/network request to pay $1
    // for a $700 watch.
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) } },
      include: { product: { include: { images: { take: 1 } } } },
    })

    const lineItems = []
    const orderItemsData = []
    let subtotal = 0

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId)
      if (!variant) {
        return NextResponse.json({ error: `Item not found.` }, { status: 400 })
      }
      if (variant.stockQuantity < item.qty) {
        return NextResponse.json(
          { error: `"${variant.product.name}" only has ${variant.stockQuantity} left in stock.` },
          { status: 400 }
        )
      }

      const price = variant.priceOverride ? Number(variant.priceOverride) : Number(variant.product.basePrice)
      subtotal += price * item.qty

      lineItems.push({
        price_data: {
          currency: variant.product.currency.toLowerCase(),
          product_data: {
            name: `${variant.product.name}${variant.dialColor ? ` — ${variant.dialColor}` : ''}`,
            images: variant.product.images[0] ? [variant.product.images[0].url] : [],
          },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity: item.qty,
      })

      orderItemsData.push({
        variantId: variant.id,
        quantity: item.qty,
        priceAtPurchase: price,
      })
    }

    // Create the order as PENDING before redirecting to Stripe — this
    // becomes our source of truth, updated to PAID by the webhook once
    // payment is actually confirmed.
    const order = await prisma.order.create({
      data: {
        guestEmail: guestEmail || null,
        status: 'PENDING',
        subtotal,
        total: subtotal, // shipping is free per our current plan
        currency: variants[0]?.product.currency ?? 'USD',
        items: { create: orderItemsData },
      },
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: guestEmail || undefined,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: { orderId: order.id },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Something went wrong creating your order.' }, { status: 500 })
  }
}
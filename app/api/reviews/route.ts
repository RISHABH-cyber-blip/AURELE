import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  const ratingFilter = searchParams.get('rating')

  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where: { productId, ...(ratingFilter ? { rating: Number(ratingFilter) } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true, avatarUrl: true } } },
  })

  const allReviews = await prisma.review.findMany({ where: { productId }, select: { rating: true } })
  const total = allReviews.length
  const average = total > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  allReviews.forEach((r) => { counts[r.rating] = (counts[r.rating] ?? 0) + 1 })

  return NextResponse.json({ reviews, summary: { average, total, counts } })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { productId, rating, title, body } = await request.json()
  if (!productId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Verify this user actually purchased the product (any paid-or-later order)
  const purchased = await prisma.orderItem.findFirst({
    where: {
      variant: { productId },
      order: { userId: user.id, status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
    },
  })
  if (!purchased) {
    return NextResponse.json({ error: 'You can only review products you have purchased.' }, { status: 403 })
  }

  const existing = await prisma.review.findFirst({
    where: { productId, userId: user.id },
  })
  if (existing) return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })

  const review = await prisma.review.create({ data: { productId, userId: user.id, rating, title, body } })
  return NextResponse.json({ review })
}
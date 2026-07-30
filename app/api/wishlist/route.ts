import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await getCurrentUser()
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!user) return NextResponse.json({ saved: false })

  if (productId) {
    const item = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: user.id, productId } } })
    return NextResponse.json({ saved: !!item })
  }

  const items = await prisma.wishlistItem.findMany({ where: { userId: user.id } })
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { productId } = await request.json()
  const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: user.id, productId } } })

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    return NextResponse.json({ saved: false })
  } else {
    await prisma.wishlistItem.create({ data: { userId: user.id, productId } })
    return NextResponse.json({ saved: true })
  }
}
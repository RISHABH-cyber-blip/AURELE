import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
          { category: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      take: 10,
      include: {
        brand: true,
        category: true,
        images: { orderBy: { position: 'asc' }, take: 1 },
        variants: { select: { dialColor: true, stockQuantity: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.basePrice),
      currency: p.currency,
      brand: p.brand.name,
      category: p.category.name,
      image: p.images[0]?.url || '',
      dialColors: Array.from(new Set(p.variants.map((v) => v.dialColor).filter(Boolean))),
    }))

    return NextResponse.json({ products: formatted })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
    await requireAdmin()
    const body = await request.json()

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const product = await prisma.product.create({
        data: {
            name: body.name,
            slug,
            description: body.description,
            style: body.style || null,
            basePrice: body.basePrice,
            brandId: body.brandId,
            categoryId: body.categoryId,
            isPublished: body.isPublished ?? true,
            images: body.imageUrl ? { create: [{ url: body.imageUrl, altText: body.name, position: 0 }] } : undefined,
        },
    })

    return NextResponse.json({ product })
}
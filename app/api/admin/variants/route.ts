import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
    await requireAdmin()
    const body = await request.json()

    const variant = await prisma.productVariant.create({
        data: {
            productId: body.productId,
            sku: body.sku,
            dialColor: body.dialColor,
            strapMaterial: body.strapMaterial || null,
            stockQuantity: Number(body.stockQuantity) || 0,
            status: 'ACTIVE',
        },
    })

    return NextResponse.json({ variant })
}

export async function DELETE(request: Request) {
    await requireAdmin()
    const { id } = await request.json()

    const variant = await prisma.productVariant.delete({
        where: { id },
    })

    return NextResponse.json({ success: true })
}
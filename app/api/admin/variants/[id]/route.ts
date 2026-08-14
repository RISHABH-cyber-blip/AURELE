import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const variant = await prisma.productVariant.update({
        where: { id },
        data: {
            stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : undefined,
            status: body.status ?? undefined,
        },
    })

    return NextResponse.json({ variant })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()
    const { id } = await params
    await prisma.productVariant.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
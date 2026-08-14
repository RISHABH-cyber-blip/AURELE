import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const order = await prisma.order.update({
        where: { id },
        data: {
            status: body.status ?? undefined,
            trackingNumber: body.trackingNumber ?? undefined,
            carrier: body.carrier ?? undefined,
        },
    })

    return NextResponse.json({ order })
}
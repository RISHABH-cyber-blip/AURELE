import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
    await requireAdmin()
    const body = await request.json()

    const deal = await prisma.deal.create({
        data: { productId: body.productId, discountPct: Number(body.discountPct), endsAt: new Date(body.endsAt) },
    })

    return NextResponse.json({ deal })
}
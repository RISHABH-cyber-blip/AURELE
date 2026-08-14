import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()
    const { id } = await params
    await prisma.deal.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
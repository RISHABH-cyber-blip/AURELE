import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, variantId } = await request.json()
    if (!email || !variantId) {
      return NextResponse.json({ error: 'Missing email or variant.' }, { status: 400 })
    }

    await prisma.restockNotification.upsert({
      where: { email_variantId: { email, variantId } },
      update: {},
      create: { email, variantId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Restock notify error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
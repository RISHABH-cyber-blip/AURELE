import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 })

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }
    await prisma.contactMessage.create({ data: { name, email, subject, message } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ addresses: [] })
  const addresses = await prisma.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: 'desc' } })
  return NextResponse.json({ addresses })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const body = await request.json()
  const { fullName, line1, line2, city, state, postalCode, country, phone, isDefault } = body

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  }

  const address = await prisma.address.create({
    data: { userId: user.id, fullName, line1, line2, city, state, postalCode, country, phone, isDefault: !!isDefault },
  })
  return NextResponse.json({ address })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { id } = await params
  await prisma.address.deleteMany({ where: { id, userId: user.id } })

  return NextResponse.json({ success: true })
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { id } = await params
  await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  await prisma.address.updateMany({ where: { id, userId: user.id }, data: { isDefault: true } })

  return NextResponse.json({ success: true })
}
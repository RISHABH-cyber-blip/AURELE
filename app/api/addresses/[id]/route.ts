import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  const { id } = await params
  await prisma.address.deleteMany({ where: { id, userId: user.id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  const { id } = await params

  await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  await prisma.address.updateMany({ where: { id, userId: user.id }, data: { isDefault: true } })

  return NextResponse.json({ success: true })
}
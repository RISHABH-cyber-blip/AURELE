import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { name, phone, avatarUrl } = await request.json()
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, phone, avatarUrl },
  })
  return NextResponse.json({ user: updated })
}
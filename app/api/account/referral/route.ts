import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const referralCode = (user as { referralCode?: string | null }).referralCode ?? null
  const referralCount = await prisma.user.count({ where: { referredById: user.id } as any })

  return NextResponse.json({ referralCode, referralCount })
}
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import { generateUniqueReferralCode } from '@/lib/referral'

function generateDefaultAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b8935f&textColor=faf6f0`
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const existing = await prisma.user.findUnique({ where: { supabaseId: authUser.id } })
  if (existing) {
    if (existing.email !== authUser.email) {
      return prisma.user.update({ where: { id: existing.id }, data: { email: authUser.email ?? existing.email } })
    }
    return existing
  }

  // First-ever login — create the row. If a referral code was captured
  // at signup (see signup page), link this new user to their referrer.
  // NOTE: this only works reliably for email/password signup — Google
  // OAuth doesn't pass through our custom metadata the same way.
  const displayName = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null
  const seed = displayName || authUser.email || authUser.id
  const referralCodeUsed = authUser.user_metadata?.referral_code as string | undefined

  let referredById: string | null = null
  if (referralCodeUsed) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: referralCodeUsed } })
    if (referrer) referredById = referrer.id
  }

  const referralCode = await generateUniqueReferralCode()

  return prisma.user.create({
    data: {
      supabaseId: authUser.id,
      email: authUser.email ?? '',
      name: displayName,
      avatarUrl: generateDefaultAvatar(seed),
      referralCode,
      referredById,
    },
  })
}
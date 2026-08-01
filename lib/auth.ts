import { createSupabaseServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

// Generates a consistent avatar automatically from a name/email "seed" —
// same person always gets the same avatar, no upload or URL-hunting needed.
function generateDefaultAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b8935f&textColor=faf6f0`
}

export async function ensureUserFromAuth({
  authUser,
  prismaClient = prisma,
}: {
  authUser: {
    id: string
    email?: string | null
    user_metadata?: {
      full_name?: string | null
      name?: string | null
    }
  }
  prismaClient?: any
}) {
  const displayName = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null
  const normalizedEmail = authUser.email?.trim().toLowerCase() ?? null
  const seed = displayName || normalizedEmail || authUser.id
  const avatarUrl = generateDefaultAvatar(seed)

  const existingBySupabaseId = await prismaClient.user
    .findUnique?.({ where: { supabaseId: authUser.id } })
    .catch(() => null)

  if (existingBySupabaseId) {
    return prismaClient.user.update({
      where: { id: existingBySupabaseId.id },
      data: {
        email: normalizedEmail ?? existingBySupabaseId.email,
        name: displayName ?? existingBySupabaseId.name,
        avatarUrl,
      },
    })
  }

  const existingByEmail = normalizedEmail
    ? await prismaClient.user
        .findUnique?.({ where: { email: normalizedEmail } })
        .catch(() => null)
        .then(async (user: unknown) => {
          if (user) return user
          return (await prismaClient.user.findFirst?.({ where: { email: normalizedEmail } }).catch(() => null)) ?? null
        })
    : null

  if (existingByEmail) {
    return prismaClient.user.update({
      where: { id: existingByEmail.id },
      data: {
        supabaseId: authUser.id,
        email: normalizedEmail ?? existingByEmail.email,
        name: displayName ?? existingByEmail.name,
        avatarUrl,
      },
    })
  }

  return prismaClient.user.create({
    data: {
      supabaseId: authUser.id,
      email: normalizedEmail ?? '',
      name: displayName,
      avatarUrl,
    },
  })
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  return ensureUserFromAuth({ authUser })
}
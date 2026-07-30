import { createSupabaseServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

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
    } | null
  }
  prismaClient?: typeof prisma
}) {
  const normalizedEmail = authUser.email?.trim() || null
  const name = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null

  const existingBySupabaseId = await prismaClient.user.findUnique({
    where: { supabaseId: authUser.id },
  })

  if (existingBySupabaseId) {
    return prismaClient.user.update({
      where: { id: existingBySupabaseId.id },
      data: {
        email: normalizedEmail ?? existingBySupabaseId.email,
        name: name ?? existingBySupabaseId.name,
        supabaseId: authUser.id,
      },
    })
  }

  if (normalizedEmail) {
    const existingByEmail = await prismaClient.user.findFirst({
      where: { email: normalizedEmail },
    })

    if (existingByEmail) {
      return prismaClient.user.update({
        where: { id: existingByEmail.id },
        data: {
          supabaseId: authUser.id,
          name: name ?? existingByEmail.name,
          email: normalizedEmail,
        },
      })
    }
  }

  return prismaClient.user.create({
    data: {
      supabaseId: authUser.id,
      email: normalizedEmail ?? '',
      name,
    },
  })
}

// Returns the current logged-in user as a real Prisma User row —
// creating one automatically on first login (via a safe fallback from
// supabaseId to email if a historical row already exists), so every
// authenticated visitor always has a matching row to attach orders,
// wishlist items, and addresses to.
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  return ensureUserFromAuth({ authUser })
}
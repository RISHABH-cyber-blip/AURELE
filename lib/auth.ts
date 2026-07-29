import { createSupabaseServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

// Returns the current logged-in user as a real Prisma User row —
// creating one automatically on first login (via upsert keyed on
// supabaseId), so every authenticated visitor always has a matching
// row to attach orders/wishlist/addresses to.
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const user = await prisma.user.upsert({
    where: { supabaseId: authUser.id },
    update: { email: authUser.email ?? undefined },
    create: {
      supabaseId: authUser.id,
      email: authUser.email ?? '',
      name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
    },
  })

  return user
}
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

// Server-side guard — used at the top of every admin page/layout.
// Redirects non-admins straight to the homepage, no error message
// revealing that an admin area even exists.
export async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user?.isAdmin) redirect('/')
    return user
}
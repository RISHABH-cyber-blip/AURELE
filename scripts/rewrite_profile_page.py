from pathlib import Path

path = Path('app/account/profile/page.tsx')
content = """import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProfileForm from '@/components/account/ProfileForm'
import { getCurrentUser } from '@/lib/auth'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <>
      <Navbar />
      <main className=\"px-6 md:px-16 pt-32 pb-24 max-w-4xl mx-auto\">
        <Link href=\"/account\" className=\"text-sm text-ink-faint hover:text-gold transition-calm\">
          ← Back to Account
        </Link>
        <h1 className=\"font-display text-4xl font-light text-ink mt-4 mb-10\">Profile</h1>
        <ProfileForm user={user} />
      </main>
    </>
  )
}
"""
path.write_text(content, encoding='utf-8')

import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import AddressManager from '@/components/account/AddressManager'
import { getCurrentUser } from '@/lib/auth'

export default async function AddressesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-2xl mx-auto">
        <Link href="/account" className="text-sm text-ink-faint hover:text-gold transition-calm">← Back to Account</Link>
        <h1 className="font-display text-4xl font-light text-ink mt-4 mb-10">Saved Addresses</h1>
        <AddressManager />
      </main>
    </>
  )
}
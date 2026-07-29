'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/account')
    router.refresh()
  }

  async function handleGoogle() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24 max-w-md mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Welcome Back</p>
        <h1 className="font-display text-4xl font-light text-ink mb-10">Sign In</h1>

        <button
          onClick={handleGoogle}
          className="w-full py-3 rounded-full border border-cream-deep text-sm text-ink mb-6 transition-calm hover:border-gold"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-cream-deep" />
          <span className="text-xs text-ink-faint">or</span>
          <span className="flex-1 h-px bg-cream-deep" />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-3 focus:outline-none focus:border-gold"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-4 focus:outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40 mb-6"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-sm text-ink-faint text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-gold hover:underline">Sign up</Link>
        </p>
      </main>
    </>
  )
}
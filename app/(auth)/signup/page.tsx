'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.session) {
      // Email confirmation is off in your Supabase settings — logged in immediately
      router.push('/account')
      router.refresh()
    } else {
      // Email confirmation is on — they need to check their inbox first
      setCheckEmail(true)
      setLoading(false)
    }
  }

  async function handleGoogle() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    })
  }

if (checkEmail) {
    return (
      <>
        <Navbar />
        <main className="px-6 pt-40 pb-24 max-w-md mx-auto text-center">
          <p className="font-display text-2xl font-light text-ink mb-3">Check your inbox</p>
          <p className="text-sm text-ink-soft mb-4">We sent a confirmation link to {email}.</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gold bg-gold/10 rounded-lg px-4 py-3 max-w-sm mx-auto">
              Dev note: emails from onboarding@resend.dev may not reach your inbox reliably.
              Check Resend → Logs and use the confirmation link directly if it doesn't arrive.
            </p>
          )}
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24 max-w-md mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Join Aurele</p>
        <h1 className="font-display text-4xl font-light text-ink mb-10">Create Account</h1>

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
          placeholder="Password (min 6 characters)"
          className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-4 focus:outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading || !email || password.length < 6}
          className="w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40 mb-6"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-sm text-ink-faint text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </main>
    </>
  )
}
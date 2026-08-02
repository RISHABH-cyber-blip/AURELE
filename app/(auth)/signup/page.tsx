'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSignup() {
    if (!agreed) return
    setLoading(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: refCode ? { data: { referral_code: refCode } } : undefined,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.session) {
      router.push('/account')
      router.refresh()
    } else {
      setCheckEmail(true)
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!agreed) return
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (checkEmail) {
    return (
      <>
        <Navbar />
        <main className="px-6 pt-40 pb-24 max-w-md mx-auto text-center">
          <p className="font-display text-2xl font-light text-ink mb-3">Check your inbox</p>
          <p className="text-sm text-ink-soft mb-4">We sent a confirmation link to {email}.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24 max-w-md mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Join Aurele</p>
        <h1 className="font-display text-4xl font-light text-ink mb-6">Create Account</h1>

        {refCode && (
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-xs text-ink-soft mb-6">
            You were invited by a friend — welcome to Aurele.
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={!agreed}
          className="w-full py-3 rounded-full border border-cream-deep text-sm text-ink mb-6 transition-calm hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-cream-deep" />
          <span className="text-xs text-ink-faint">or</span>
          <span className="flex-1 h-px bg-cream-deep" />
        </div>

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-3 focus:outline-none focus:border-gold" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-4 focus:outline-none focus:border-gold" />

        <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-gold mt-0.5 w-4 h-4 flex-shrink-0" />
          <span className="text-xs text-ink-soft leading-relaxed">
            I have read and agree to the{' '}
            <Link href="/legal/terms" target="_blank" className="text-gold underline">Terms & Conditions</Link>
            {' '}and{' '}
            <Link href="/legal/privacy" target="_blank" className="text-gold underline">Privacy Policy</Link>.
          </span>
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading || !email || password.length < 6 || !agreed}
          className="w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40 mb-6"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-sm text-ink-faint text-center">
          Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </main>
    </>
  )
}
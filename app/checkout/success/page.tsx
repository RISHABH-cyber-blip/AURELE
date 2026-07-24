'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useCartStore } from '@/store/cart-store'

export default function CheckoutSuccessPage() {
  const clear = useCartStore((s) => s.clear)

  useEffect(() => {
    clear() // empty the cart now that payment succeeded
  }, [clear])

  return (
    <>
      <Navbar />
      <main className="px-6 pt-40 pb-24 text-center max-w-lg mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-4">Order Confirmed</p>
        <h1 className="font-display text-4xl font-light text-ink mb-5">Thank You</h1>
        <p className="text-ink-soft mb-10">
          Your order has been placed. A confirmation email is on its way — you'll also be able to
          track it from your account once you're signed in.
        </p>
        <Link
          href="/shop"
          className="inline-block px-9 py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85"
        >
          Continue Shopping
        </Link>
      </main>
    </>
  )
}
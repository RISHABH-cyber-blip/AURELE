'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  async function handlePay() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
        guestEmail: email,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    const razorpayOptions = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: 'Aurele',
      description: 'Order Payment',
      prefill: { email },
      theme: { color: '#B8935F' }, // matches our gold accent
      handler: async function (response: any) {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            internalOrderId: data.internalOrderId,
          }),
        })

        if (verifyRes.ok) {
          router.push('/checkout/success')
        } else {
          setError('Payment succeeded but verification failed — contact support.')
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    }

    const razorpayInstance = new window.Razorpay(razorpayOptions)
    razorpayInstance.open()
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="px-6 pt-40 text-center">
          <p className="text-ink-soft">Your cart is empty.</p>
        </main>
      </>
    )
  }

  return (
    <>
      {/* Razorpay's checkout widget script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-2xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Checkout</p>
        <h1 className="font-display text-4xl font-light text-ink mb-10">Complete Your Order</h1>

        <div className="bg-cream-soft rounded-2xl p-7 mb-8">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm py-2">
              <span className="text-ink-soft">
                {item.name} × {item.qty}
              </span>
              <span className="text-ink">{formatPrice(item.price * item.qty, item.currency)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-4 border-t border-cream-deep">
            <span className="text-ink">Total</span>
            <span className="font-display text-xl text-ink">{formatPrice(totalPrice())}</span>
          </div>
        </div>

        <label className="block text-xs tracking-wide uppercase text-ink-faint mb-2">
          Email for order confirmation
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-cream-soft border border-cream-deep rounded-lg px-4 py-3 text-sm text-ink mb-6 focus:outline-none focus:border-gold"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading || !email}
          className="w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40"
        >
          {loading ? 'Opening secure payment…' : 'Pay Securely with Razorpay'}
        </button>
      </main>
    </>
  )
}
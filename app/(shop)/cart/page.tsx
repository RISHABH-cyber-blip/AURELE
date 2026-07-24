'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQty, removeItem, totalPrice } = useCartStore()

  // Same hydration-safety pattern as the Navbar badge — cart data lives
  // in localStorage, which the server can't see, so we wait for mount
  // before rendering real cart contents.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const subtotal = mounted ? totalPrice() : 0

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24 max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Your Selection</p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-ink mb-12">Cart</h1>

        {!mounted ? null : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-soft mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="inline-block px-9 py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85"
            >
              Explore the Collection
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {/* Items */}
            <div className="md:col-span-2 flex flex-col divide-y divide-cream-deep">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-5 py-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-cream-soft flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] tracking-[2px] uppercase text-ink-faint mb-1">
                      {item.brand}
                    </p>
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="font-display text-lg text-ink hover:text-gold transition-calm"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-faint mt-1">
                      {[item.dialColor, item.strapMaterial].filter(Boolean).join(' · ')}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-cream-deep rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQty(item.variantId, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.variantId, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink-soft hover:bg-cream-soft transition-calm"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-ink">
                          {formatPrice(item.price * item.qty, item.currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-ink-faint hover:text-gold transition-calm underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit bg-cream-soft rounded-2xl p-7">
              <h2 className="font-display text-xl text-ink mb-6">Order Summary</h2>
              <div className="flex justify-between text-sm text-ink-soft mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-6">
                <span className="text-ink-soft">Shipping</span>
                <span className="font-mono text-xs tracking-wide text-gold">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-5 border-t border-cream-deep mb-6">
                <span className="text-ink">Total</span>
                <span className="font-display text-2xl text-ink">{formatPrice(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full py-3.5 rounded-full text-[14px] tracking-wide font-medium bg-ink text-cream transition-calm hover:opacity-85 mb-3"
              >
                Checkout
              </Link>
              <Link
                href="/shop"
                className="block text-center w-full py-2.5 text-sm text-ink-faint hover:text-ink transition-calm"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
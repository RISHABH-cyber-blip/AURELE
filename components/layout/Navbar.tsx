'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import { NAV_LINKS } from '@/data'
import { useCartStore } from '@/store/cart-store'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const totalQty = useCartStore((s) => s.totalQty())

  // Cart is persisted to localStorage, which doesn't exist during server
  // rendering — this avoids a mismatch flash between server and client.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-calm ${
        scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-cream-deep' : 'border-b border-transparent'
      }`}
    >
      <Link href="/" className="font-display text-2xl md:text-3xl tracking-[3px] text-ink font-light">
        AURELE
      </Link>

      <ul className="hidden md:flex items-center gap-9 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[13px] tracking-wide text-ink-soft hover:text-gold transition-calm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-5 text-ink">
        <button aria-label="Search" className="hover:text-gold transition-calm">
          <Search size={19} strokeWidth={1.5} />
        </button>
        <Link href="/account" aria-label="Account" className="hidden sm:block hover:text-gold transition-calm">
          <User size={19} strokeWidth={1.5} />
        </Link>
        <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-calm">
          <Heart size={19} strokeWidth={1.5} />
        </Link>
        <Link href="/cart" aria-label="Cart" className="relative hover:text-gold transition-calm">
          <ShoppingBag size={19} strokeWidth={1.5} />
          {mounted && totalQty > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-gold text-ink">
              {totalQty}
            </span>
          )}
        </Link>
      </div>
    </motion.nav>
  )
}
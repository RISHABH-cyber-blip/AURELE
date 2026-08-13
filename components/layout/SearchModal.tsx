'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Loader2, Watch } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  brand: string
  category: string
  image: string
  dialColors: string[]
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = ['Rolex', 'Chronograph', 'Automatic', 'Submariner', 'Gold', 'Leather']

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setSearched(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setSearched(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        }
      } catch (err) {
        console.error('Failed to search watches:', err)
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectProduct = (slug: string) => {
    onClose()
    router.push(`/product/${slug}`)
  }

  const handleQuickTagClick = (tag: string) => {
    setQuery(tag)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-cream border border-cream-deep/80 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Header */}
            <div className="p-4 sm:p-6 border-b border-cream-deep/60 bg-cream/90">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-ink-faint w-5 h-5 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by watch name, brand, or style..."
                  className="w-full bg-cream-soft/60 border border-cream-deep rounded-full pl-12 pr-12 py-3.5 text-ink placeholder:text-ink-faint text-sm sm:text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-light"
                />
                {query ? (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 text-ink-faint hover:text-ink transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="absolute right-4 text-ink-faint hover:text-ink text-xs uppercase tracking-widest font-mono hidden sm:block"
                  >
                    ESC
                  </button>
                )}
              </div>

              {/* Popular Searches */}
              {!query && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-faint mr-1">Trending:</span>
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickTagClick(tag)}
                      className="text-xs px-3 py-1 rounded-full border border-cream-deep bg-cream/50 text-ink-soft hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
              {loading && (
                <div className="py-12 flex flex-col items-center justify-center text-ink-faint gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-gold" />
                  <p className="text-xs uppercase tracking-widest font-mono">Searching Timepieces...</p>
                </div>
              )}

              {!loading && searched && results.length === 0 && (
                <div className="py-12 text-center text-ink-faint">
                  <Watch className="w-10 h-10 mx-auto mb-3 opacity-30 text-ink-faint" />
                  <p className="text-sm font-medium text-ink">No timepieces found matching &quot;{query}&quot;</p>
                  <p className="text-xs text-ink-faint mt-1">Try searching for Rolex, Chronograph, or Tudor</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest font-mono text-gold mb-3 px-1">
                    Found {results.length} timepiece{results.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid gap-2">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-cream-deep hover:bg-cream-soft/80 transition-all duration-200 cursor-pointer"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream-soft shrink-0 border border-cream-deep/40">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink-faint">
                              <Watch size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-0.5">
                            {product.brand}
                          </p>
                          <h4 className="text-sm font-medium text-ink truncate group-hover:text-gold transition-colors">
                            {product.name}
                          </h4>
                          {product.dialColors.length > 0 && (
                            <p className="text-xs text-ink-faint truncate mt-0.5">
                              Dial: {product.dialColors.join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <span className="text-sm font-semibold text-ink">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          <ArrowRight
                            size={16}
                            className="text-ink-faint group-hover:text-gold group-hover:translate-x-1 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

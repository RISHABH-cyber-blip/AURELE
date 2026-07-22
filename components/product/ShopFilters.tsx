'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  brands: { name: string; slug: string }[]
  dialColors: string[]
}

export default function ShopFilters({ brands, dialColors }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedBrands = searchParams.get('brands')?.split(',').filter(Boolean) ?? []
  const selectedColors = searchParams.get('colors')?.split(',').filter(Boolean) ?? []
  const category = searchParams.get('category') ?? ''
  const minPrice = searchParams.get('min') ?? ''
  const maxPrice = searchParams.get('max') ?? ''

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key)
      else params.set(key, value)
    })
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggleBrand(slug: string) {
    const next = selectedBrands.includes(slug) ? selectedBrands.filter((b) => b !== slug) : [...selectedBrands, slug]
    updateParams({ brands: next.join(',') || null })
  }

  function toggleColor(color: string) {
    const next = selectedColors.includes(color) ? selectedColors.filter((c) => c !== color) : [...selectedColors, color]
    updateParams({ colors: next.join(',') || null })
  }

  const hasActiveFilters = selectedBrands.length > 0 || selectedColors.length > 0 || category || minPrice || maxPrice

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
      <div>
        <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-ink-faint mb-4">Category</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: 'All', value: '' },
            { label: "Men's", value: 'mens' },
            { label: "Women's", value: 'womens' },
            { label: 'Unisex', value: 'unisex' },
          ].map((c) => (
            <button
              key={c.value}
              onClick={() => updateParams({ category: c.value || null })}
              className={`text-left text-sm transition-calm ${category === c.value ? 'text-gold font-medium' : 'text-ink-soft hover:text-ink'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-ink-faint mb-4">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParams({ min: e.target.value || null })}
            className="w-full bg-cream-soft border border-cream-deep rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold"
          />
          <span className="text-ink-faint">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParams({ max: e.target.value || null })}
            className="w-full bg-cream-soft border border-cream-deep rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-ink-faint mb-4">Brand</h3>
        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-2">
          {brands.map((b) => (
            <label key={b.slug} className="flex items-center gap-2.5 text-sm text-ink-soft cursor-pointer hover:text-ink transition-calm">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.slug)}
                onChange={() => toggleBrand(b.slug)}
                className="accent-gold w-3.5 h-3.5"
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-ink-faint mb-4">Dial Color</h3>
        <div className="flex flex-wrap gap-2">
          {dialColors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-calm ${
                selectedColors.includes(color) ? 'border-gold text-gold bg-gold/10' : 'border-cream-deep text-ink-soft hover:border-ink-faint'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={() => router.push(pathname)} className="text-xs tracking-wide text-ink-faint hover:text-gold underline transition-calm">
          Clear all filters
        </button>
      )}
    </aside>
  )
}
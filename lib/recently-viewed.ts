// Tracks recently viewed products in localStorage — no login required,
// works for anonymous visitors, capped at 8 items.
const KEY = 'aurele-recently-viewed'
const MAX_ITEMS = 8

export interface RecentlyViewedItem {
  slug: string
  name: string
  brand: string
  price: number
  currency: string
  image: string
}

function normalizeImage(image?: string | null) {
  if (typeof image !== 'string') return '/images/placeholder-watch.svg'
  const trimmed = image.trim()
  return trimmed ? trimmed : '/images/placeholder-watch.svg'
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((value): value is RecentlyViewedItem => Boolean(value && typeof value === 'object'))
      .map((item) => ({
        ...item,
        image: normalizeImage(item.image),
      }))
  } catch {
    return []
  }
}

export function addRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === 'undefined') return
  const current = getRecentlyViewed().filter((i) => i.slug !== item.slug)
  const next = [{ ...item, image: normalizeImage(item.image) }, ...current].slice(0, MAX_ITEMS)
  localStorage.setItem(KEY, JSON.stringify(next))
}
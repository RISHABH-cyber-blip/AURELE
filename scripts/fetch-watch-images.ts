/**
 * WHAT THIS FILE DOES:
 * For each of the 8 dial colors, queries Unsplash TWICE (different
 * phrasing) using their official `color` filter, so results are
 * actually the right color — not just keyword-matched. Filters out
 * jewelry via the blocklist/allowlist check, deduplicates by photo ID
 * GLOBALLY (a photo used for "Black" can never repeat in "Blue"),
 * and keeps up to 24 unique real photos per color.
 *
 * This fixes two problems at once:
 *   1. "Filtered black, got shown gold" — because we now fetch by
 *      actual color, not by brand.
 *   2. "Same watch repeating" — 24-deep rotation per color instead of
 *      reusing ~10 photos per brand.
 *
 * Run whenever you want a fresh/bigger photo pool:
 *   npx tsx --env-file=.env scripts/fetch-watch-images.ts
 */
import { writeFileSync } from 'fs'
import { COLOR_QUERIES } from '../prisma/seed-data'

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const CANDIDATES_PER_QUERY = 30
const POOL_SIZE_PER_COLOR = 24

const BLOCKLIST = [
  'necklace', 'ring', 'earring', 'earrings', 'bracelet', 'pendant',
  'brooch', 'anklet', 'jewelry', 'jewellery', 'gemstone', 'diamond ring',
]
const ALLOWLIST = [
  'watch', 'wristwatch', 'timepiece', 'dial', 'chronograph', 'strap', 'clock face',
]

interface UnsplashPhoto {
  id: string
  urls: { regular: string }
  alt_description: string | null
  description: string | null
}

function describeText(photo: UnsplashPhoto): string {
  return `${photo.alt_description ?? ''} ${photo.description ?? ''}`.toLowerCase()
}
function containsAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w))
}
function passesJewelryFilter(photo: UnsplashPhoto, strict: boolean): boolean {
  const text = describeText(photo)
  if (containsAny(text, BLOCKLIST)) return false
  return strict ? containsAny(text, ALLOWLIST) : true
}

async function fetchCandidates(query: string, unsplashColor?: string): Promise<UnsplashPhoto[]> {
  const url = new URL('https://api.unsplash.com/search/photos')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(CANDIDATES_PER_QUERY))
  url.searchParams.set('orientation', 'squarish')
  url.searchParams.set('content_filter', 'high')
  if (unsplashColor) url.searchParams.set('color', unsplashColor)

  const res = await fetch(url.toString(), { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } })
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.results ?? []
}

async function main() {
  if (!ACCESS_KEY) {
    console.error('Missing UNSPLASH_ACCESS_KEY in .env')
    process.exit(1)
  }

  const globallyUsedIds = new Set<string>() // prevents the same photo appearing in 2 different colors
  const results: Record<string, string[]> = {}

  for (const [colorName, config] of Object.entries(COLOR_QUERIES)) {
    console.log(`\nFetching "${colorName}" (Unsplash color: ${config.unsplashColor ?? 'none, keyword-only'})`)
    const collected: UnsplashPhoto[] = []

    for (const query of config.queries) {
      try {
        const candidates = await fetchCandidates(query, config.unsplashColor)
        console.log(`  "${query}" -> ${candidates.length} raw candidates`)
        collected.push(...candidates)
      } catch (err) {
        console.error(`  Failed on "${query}":`, err)
      }
      await new Promise((r) => setTimeout(r, 300)) // stay well under Unsplash's rate limit
    }

    // Strict pass first (blocklist + allowlist), relax to blocklist-only if too few survive
    let kept = collected.filter((p) => !globallyUsedIds.has(p.id) && passesJewelryFilter(p, true))
    if (kept.length < POOL_SIZE_PER_COLOR) {
      const relaxed = collected.filter((p) => !globallyUsedIds.has(p.id) && passesJewelryFilter(p, false))
      kept = [...new Map([...kept, ...relaxed].map((p) => [p.id, p])).values()]
    }
    kept = kept.slice(0, POOL_SIZE_PER_COLOR)
    kept.forEach((p) => globallyUsedIds.add(p.id))

    results[colorName] = kept.map((p) => p.urls.regular)
    console.log(`  -> kept ${kept.length} unique real photos for "${colorName}"`)
  }

  writeFileSync('data/watch-images.json', JSON.stringify(results, null, 2))
  const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`\nSaved ${total} total unique real watch photos across ${Object.keys(results).length} colors.`)
}

main()
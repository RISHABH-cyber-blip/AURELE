/**
 * WHAT THIS FILE DOES:
 * Calls Unsplash's search API once per brand, requesting 30 candidate
 * photos (instead of settling for the raw top 10). Runs each candidate
 * through isLikelyWatchPhoto() to reject jewelry/fashion photos that
 * happen to match the search keyword, then keeps up to 10 that pass.
 * Saves the survivors to data/brand-images.json for seed.ts to use.
 *
 * Run this whenever you want fresh/better photos:
 *   npx tsx --env-file=.env scripts/fetch-brand-images.ts
 */
import { writeFileSync } from 'fs'
import { BRANDS } from '../prisma/seed-data'

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const CANDIDATES_PER_BRAND = 30 // fetch more than we need, so filtering has room to reject bad ones
const KEEP_PER_BRAND = 10

// Words that mean "this is jewelry/fashion accessory, not a watch" —
// reject any photo whose description contains one of these.
const BLOCKLIST = [
  'necklace', 'ring', 'earring', 'earrings', 'bracelet', 'pendant',
  'brooch', 'anklet', 'jewelry', 'jewellery', 'gemstone', 'diamond ring',
]

// Words that confirm "this is actually a watch photo" — require at
// least one of these to be present.
const ALLOWLIST = [
  'watch', 'wristwatch', 'timepiece', 'dial', 'chronograph', 'strap', 'clock face',
]

interface UnsplashPhoto {
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

/**
 * The filtering algorithm itself. Two-pass so we never end up with
 * zero images even if a brand's search term is a bit unusual:
 *   Pass 1 (strict):  must pass BOTH blocklist and allowlist checks
 *   Pass 2 (fallback): if pass 1 didn't yield enough, relax to
 *                       blocklist-only — still guarantees no jewelry,
 *                       just doesn't require the word "watch" to appear
 *                       in Unsplash's (sometimes sparse) description text
 */
function filterWatchPhotos(photos: UnsplashPhoto[]): UnsplashPhoto[] {
  const strict = photos.filter((p) => {
    const text = describeText(p)
    return !containsAny(text, BLOCKLIST) && containsAny(text, ALLOWLIST)
  })

  if (strict.length >= KEEP_PER_BRAND) return strict.slice(0, KEEP_PER_BRAND)

  const relaxed = photos.filter((p) => !containsAny(describeText(p), BLOCKLIST))
  return relaxed.slice(0, KEEP_PER_BRAND)
}

async function fetchCandidates(searchTerm: string): Promise<UnsplashPhoto[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${CANDIDATES_PER_BRAND}&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.results ?? []
}

async function main() {
  if (!ACCESS_KEY) {
    console.error('Missing UNSPLASH_ACCESS_KEY in .env')
    process.exit(1)
  }

  const results: Record<string, string[]> = {}

  for (const brand of BRANDS) {
    console.log(`Fetching candidates for ${brand.name} ("${brand.searchTerm}")...`)
    try {
      const candidates = await fetchCandidates(brand.searchTerm)
      const kept = filterWatchPhotos(candidates)
      results[brand.slug] = kept.map((p) => p.urls.regular)
      console.log(`  ${candidates.length} candidates -> ${kept.length} kept after jewelry filter`)
    } catch (err) {
      console.error(`  Failed for ${brand.name}:`, err)
      results[brand.slug] = []
    }
    await new Promise((r) => setTimeout(r, 300)) // stay well under Unsplash rate limits
  }

  writeFileSync('data/brand-images.json', JSON.stringify(results, null, 2))
  const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`\nSaved ${total} filtered watch images across ${Object.keys(results).length} brands.`)
}

main()
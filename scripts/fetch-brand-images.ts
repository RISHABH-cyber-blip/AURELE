/**
 * WHAT THIS FILE DOES:
 * Calls Unsplash's search API once per brand (15 calls total), asking
 * for up to 10 photos per call instead of 1. Saves all 10 URLs per
 * brand to data/brand-images.json as an array, so seed.ts can rotate
 * through different real photos per product instead of reusing one.
 *
 * Run this ONCE (or whenever you want fresh photos):
 *   npx tsx --env-file=.env scripts/fetch-brand-images.ts
 */
import { writeFileSync } from 'fs'
import { BRANDS } from '../prisma/seed-data'

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const PHOTOS_PER_BRAND = 10 // 15 brands x 10 = 150 total, still 15 API calls

async function fetchImagesFor(searchTerm: string): Promise<string[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${PHOTOS_PER_BRAND}&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  // .urls.regular = a good-quality, reasonably-sized version of each photo
  return (data.results ?? []).map((photo: any) => photo.urls.regular)
}

async function main() {
  if (!ACCESS_KEY) {
    console.error('Missing UNSPLASH_ACCESS_KEY in .env')
    process.exit(1)
  }

  // results shape: { "brand-slug": ["url1", "url2", ...10 urls], ... }
  const results: Record<string, string[]> = {}

  for (const brand of BRANDS) {
    console.log(`Fetching ${PHOTOS_PER_BRAND} images for ${brand.name} ("${brand.searchTerm}")...`)
    try {
      const urls = await fetchImagesFor(brand.searchTerm)
      results[brand.slug] = urls
      console.log(`  got ${urls.length} photos`)
    } catch (err) {
      console.error(`  Failed for ${brand.name}:`, err)
      results[brand.slug] = []
    }
    await new Promise((r) => setTimeout(r, 300)) // stay well under rate limits
  }

  writeFileSync('data/brand-images.json', JSON.stringify(results, null, 2))
  const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`\nSaved ${total} total images across ${Object.keys(results).length} brands.`)
}

main()
/**
 * Calls Unsplash's official API once per brand (15 calls total — well
 * under the free tier's 50/hour limit) to pull one real, licensed photo
 * per brand. Saves the results so seed.ts can reuse them across each
 * brand's 30 products. Run this ONCE, not on every seed.
 *
 * Usage: npx tsx --env-file=.env scripts/fetch-brand-images.ts
 */
import { writeFileSync } from 'fs'
import { BRANDS } from '../prisma/seed-data'

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

async function fetchImageFor(searchTerm: string): Promise<string> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  const photo = data.results?.[0]
  if (!photo) throw new Error(`No results for "${searchTerm}"`)
  return photo.urls.regular // good balance of quality vs file size
}

async function main() {
  if (!ACCESS_KEY) {
    console.error('Missing UNSPLASH_ACCESS_KEY in .env — see setup instructions.')
    process.exit(1)
  }

  const results: Record<string, string> = {}

  for (const brand of BRANDS) {
    console.log(`Fetching image for ${brand.name} ("${brand.searchTerm}")...`)
    try {
      results[brand.slug] = await fetchImageFor(brand.searchTerm)
    } catch (err) {
      console.error(`  Failed for ${brand.name}:`, err)
      results[brand.slug] = '' // seed.ts will fall back to a placeholder
    }
    // Unsplash free tier is rate-limited — small delay to be polite
    await new Promise((r) => setTimeout(r, 300))
  }

  writeFileSync('data/brand-images.json', JSON.stringify(results, null, 2))
  console.log(`\nSaved ${Object.keys(results).length} brand images to data/brand-images.json`)
}

main()
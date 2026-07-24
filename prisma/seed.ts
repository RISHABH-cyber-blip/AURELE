import { PrismaClient, VariantStatus } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { BRANDS, MODEL_LINES, SIZES, DIAL_COLORS, STRAPS, STYLES, PRODUCTS_PER_BRAND, seededPick } from './seed-data'

const prisma = new PrismaClient()

function loadColorImages(): Record<string, string[]> {
  if (existsSync('data/watch-images.json')) {
    return JSON.parse(readFileSync('data/watch-images.json', 'utf-8'))
  }
  return {}
}

async function main() {
  const colorImages = loadColorImages()
  const hasRealPhotos = Object.keys(colorImages).length > 0
  console.log(hasRealPhotos ? 'Using real, color-matched Unsplash photos.' : 'No data/watch-images.json found — run fetch-watch-images.ts first.')

  // Fallback pool combining ALL colors — only used if a specific color's
  // pool is somehow empty. Still real photos, never the placeholder graphic,
  // unless watch-images.json doesn't exist at all.
  const allPhotosFallback = Object.values(colorImages).flat()

  // Tracks how far we've rotated through each color's pool, so products
  // cycle sequentially instead of repeating early.
  const colorRotation: Record<string, number> = {}
  function nextImageForColor(color: string): string {
    const pool = colorImages[color]?.length ? colorImages[color] : allPhotosFallback
    if (pool.length === 0) {
      return `https://placehold.co/800x800/1a1a1a/e7ddcc?text=${encodeURIComponent(color)}`
    }
    const i = colorRotation[color] ?? 0
    colorRotation[color] = i + 1
    return pool[i % pool.length]
  }

  const mens = await prisma.category.upsert({ where: { slug: 'mens' }, update: {}, create: { name: "Men's", slug: 'mens' } })
  const womens = await prisma.category.upsert({ where: { slug: 'womens' }, update: {}, create: { name: "Women's", slug: 'womens' } })
  const unisex = await prisma.category.upsert({ where: { slug: 'unisex' }, update: {}, create: { name: 'Unisex', slug: 'unisex' } })
  const categories = [mens, womens, unisex]

  const brandRecords = []
  for (const b of BRANDS) {
    brandRecords.push(await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b }))
  }

  let productCount = 0
  let variantCount = 0

  for (let bIdx = 0; bIdx < brandRecords.length; bIdx++) {
    const brand = brandRecords[bIdx]

    for (let p = 0; p < PRODUCTS_PER_BRAND; p++) {
      const line = seededPick(MODEL_LINES, bIdx + p)
      const size = seededPick(SIZES, bIdx * 2 + p)
      const style = seededPick(STYLES, bIdx * 3 + p)
      const category = seededPick(categories, bIdx + p)
      const basePrice = 150 + ((bIdx * 37 + p * 19) % 550)

      const productName = `${brand.name.split(' ')[0]} ${line} ${size} ${String(p + 1).padStart(2, '0')}`
      const slug = `${brand.slug}-${line.toLowerCase()}-${size}-${p + 1}`

      // The product's "primary" dial color is its first variant's color
      // (v=0 below uses this exact same seed) — used to pick a photo
      // that actually matches what the card/filter will show.
      const primaryDialColor = seededPick(DIAL_COLORS, bIdx + p)
      const imageUrl = nextImageForColor(primaryDialColor)

      const product = await prisma.product.upsert({
        where: { slug },
        update: { images: { deleteMany: {}, create: [{ url: imageUrl, altText: productName, position: 0 }] } },
        create: {
          name: productName,
          slug,
          description: `A ${size}mm ${style.toLowerCase().replace('_', ' ')} watch from ${brand.name}.`,
          style,
          basePrice,
          brandId: brand.id,
          categoryId: category.id,
          images: { create: [{ url: imageUrl, altText: productName, position: 0 }] },
        },
      })
      productCount++

      const variantTotal = 2 + (p % 2)
      for (let v = 0; v < variantTotal; v++) {
        const dialColor = seededPick(DIAL_COLORS, bIdx + p + v)
        const strapMaterial = seededPick(STRAPS, bIdx + p + v * 2)
        const sku = `${slug}-${dialColor.toLowerCase()}-${strapMaterial.toLowerCase()}`
        const stockRoll = (bIdx + p + v) % 10
        const stockQuantity = stockRoll === 0 ? 0 : stockRoll <= 2 ? stockRoll : 6 + stockRoll

        await prisma.productVariant.upsert({
          where: { sku },
          update: { stockQuantity },
          create: { sku, productId: product.id, dialColor, strapMaterial, stockQuantity, status: VariantStatus.ACTIVE },
        })
        variantCount++
      }
    }
    console.log(`  ${brand.name}: done`)
  }

  console.log(`\nSeeded ${brandRecords.length} brands, ${productCount} products, ${variantCount} variants.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
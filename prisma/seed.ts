import { PrismaClient, VariantStatus } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { BRANDS, MODEL_LINES, SIZES, DIAL_COLORS, STRAPS, STYLES, PRODUCTS_PER_BRAND, seededPick } from './seed-data'

const prisma = new PrismaClient()

// CHANGED: now loads an ARRAY of images per brand (was a single string before)
function loadBrandImages(): Record<string, string[]> {
  if (existsSync('data/brand-images.json')) {
    return JSON.parse(readFileSync('data/brand-images.json', 'utf-8'))
  }
  return {}
}

async function main() {
  const brandImages = loadBrandImages()
  const usingRealPhotos = Object.keys(brandImages).length > 0
  console.log(usingRealPhotos ? 'Using real Unsplash photos.' : 'No brand-images.json found — using placeholders.')

  const mens = await prisma.category.upsert({ where: { slug: 'mens' }, update: {}, create: { name: "Men's", slug: 'mens' } })
  const womens = await prisma.category.upsert({ where: { slug: 'womens' }, update: {}, create: { name: "Women's", slug: 'womens' } })
  const unisex = await prisma.category.upsert({ where: { slug: 'unisex' }, update: {}, create: { name: 'Unisex', slug: 'unisex' } })
  const categories = [mens, womens, unisex]

  const brandRecords = []
  for (const b of BRANDS) {
    brandRecords.push(
      await prisma.brand.upsert({
        where: { slug: b.slug },
        update: {},
        create: { name: b.name, slug: b.slug, description: b.description },
      })
    )
  }

  let productCount = 0
  let variantCount = 0

  for (let bIdx = 0; bIdx < brandRecords.length; bIdx++) {
    const brand = brandRecords[bIdx]!
    const brandSlug = BRANDS[bIdx]!.slug
    // CHANGED: this brand's pool of (up to) 10 real photos
    const imagePool = brandImages[brandSlug] ?? []

    for (let p = 0; p < PRODUCTS_PER_BRAND; p++) {
      const line = seededPick(MODEL_LINES, bIdx + p)
      const size = seededPick(SIZES, bIdx * 2 + p)
      const style = seededPick(STYLES, bIdx * 3 + p)
      const category = seededPick(categories, bIdx + p)
      const basePrice = 150 + ((bIdx * 37 + p * 19) % 550)

      const productName = `${brand.name.split(' ')[0]} ${line} ${size} ${String(p + 1).padStart(2, '0')}`
      const slug = `${brand.slug}-${line.toLowerCase()}-${size}-${p + 1}`

      // CHANGED: cycle through the brand's photo pool instead of reusing one.
      // Product 0 gets photo[0], product 1 gets photo[1], ... product 10
      // wraps back to photo[0], etc. — real variety without more API calls.
      const imageUrl: string =
        imagePool.length > 0
          ? imagePool[p % imagePool.length]!
          : `https://placehold.co/800x800/1a1a1a/e7ddcc?text=${encodeURIComponent(brand.name)}`

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
    console.log(`  ${brand.name}: done (${imagePool.length} unique photos used)`)
  }

  console.log(`\nSeeded ${brandRecords.length} brands, ${productCount} products, ${variantCount} variants.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
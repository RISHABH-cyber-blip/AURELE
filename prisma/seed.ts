import { PrismaClient, WatchStyle, StrapMaterial, VariantStatus } from '@prisma/client'

const prisma = new PrismaClient()
type BrandResult = Awaited<ReturnType<typeof prisma.brand.upsert>>

// Fictional-but-plausible brands (see earlier note on why real trademarked
// names/photos aren't used without an actual distributor agreement).
// Image URLs below are placeholders — replace with your own Cloudinary URLs
// once you've uploaded stock photos (see instructions after this file).

async function main() {
  // ── Categories ──
  const mens = await prisma.category.upsert({
    where: { slug: 'mens' },
    update: {},
    create: { name: "Men's", slug: 'mens' },
  })
  const womens = await prisma.category.upsert({
    where: { slug: 'womens' },
    update: {},
    create: { name: "Women's", slug: 'womens' },
  })
  const unisex = await prisma.category.upsert({
    where: { slug: 'unisex' },
    update: {},
    create: { name: 'Unisex', slug: 'unisex' },
  })

  // ── Brands ──
  const brandData = [
    { name: 'Solstice & Vane', slug: 'solstice-vane', description: 'Precision chronographs, quietly engineered.' },
    { name: 'Meridian House', slug: 'meridian-house', description: 'Heritage dress watches since a fictional 1962.' },
    { name: 'Verlainne', slug: 'verlainne', description: 'Minimalist automatics for daily wear.' },
    { name: 'Castellane', slug: 'castellane', description: "Women's fine watches with interchangeable straps." },
    { name: 'Northfield & Sons', slug: 'northfield-sons', description: 'Rugged field watches, built to outlast.' },
    {name: 'Aurum & Co.', slug: 'aurum-co', description: 'Luxury watches with a modern twist.'},
  ]

  const brands = await Promise.all(
    brandData.map((b) => prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b }))
  ) as [BrandResult, BrandResult, BrandResult, BrandResult, BrandResult, BrandResult]
  const [solstice, meridian, verlainne, castellane, northfield, aurum] = brands

  // ── Products + Variants ──
  // Each product gets 2-3 variants (dial color / strap combos) with real
  // stock numbers, including one deliberately at 0 and one "low stock"
  // so you can see all three stock states working immediately.
  const products = [
    {
      name: 'Solstice Chrono 42',
      slug: 'solstice-chrono-42',
      brand: solstice,
      category: mens,
      style: WatchStyle.CHRONOGRAPH,
      basePrice: 349,
      description: 'A 42mm stainless steel chronograph with a tachymeter bezel.',
      image: 'https://placehold.co/800x800/1a1a1a/e7ddcc?text=Solstice+Chrono+42',
      variants: [
        { dialColor: 'Black', strapMaterial: StrapMaterial.METAL, stockQuantity: 14 },
        { dialColor: 'Silver', strapMaterial: StrapMaterial.LEATHER, stockQuantity: 2 }, // low stock
        { dialColor: 'Blue', strapMaterial: StrapMaterial.METAL, stockQuantity: 0 },     // out of stock
      ],
    },
    {
      name: 'Meridian Classic 38',
      slug: 'meridian-classic-38',
      brand: meridian,
      category: unisex,
      style: WatchStyle.ANALOG,
      basePrice: 289,
      description: 'A slim 38mm dress watch with a domed sapphire crystal.',
      image: 'https://placehold.co/800x800/b8935f/1a1a1a?text=Meridian+Classic+38',
      variants: [
        { dialColor: 'White', strapMaterial: StrapMaterial.LEATHER, stockQuantity: 9 },
        { dialColor: 'Black', strapMaterial: StrapMaterial.LEATHER, stockQuantity: 6 },
      ],
    },
    {
      name: 'Verlainne Automatic 40',
      slug: 'verlainne-automatic-40',
      brand: verlainne,
      category: mens,
      style: WatchStyle.AUTOMATIC,
      basePrice: 459,
      description: 'A skeleton-dial automatic with a 42-hour power reserve.',
      image: 'https://placehold.co/800x800/1a1a1a/b8935f?text=Verlainne+Automatic',
      variants: [
        { dialColor: 'Silver', strapMaterial: StrapMaterial.MESH, stockQuantity: 11 },
        { dialColor: 'Gunmetal', strapMaterial: StrapMaterial.METAL, stockQuantity: 4 },
      ],
    },
    {
      name: 'Castellane Petite 34',
      slug: 'castellane-petite-34',
      brand: castellane,
      category: womens,
      style: WatchStyle.ANALOG,
      basePrice: 259,
      description: 'A 34mm case with an interchangeable quick-release strap.',
      image: 'https://placehold.co/800x800/e7ddcc/1a1a1a?text=Castellane+Petite',
      variants: [
        { dialColor: 'Rose', strapMaterial: StrapMaterial.LEATHER, stockQuantity: 17 },
        { dialColor: 'White', strapMaterial: StrapMaterial.METAL, stockQuantity: 8 },
        { dialColor: 'Black', strapMaterial: StrapMaterial.SILICONE, stockQuantity: 1 }, // low stock
      ],
    },
    {
      name: 'Northfield Trailhand',
      slug: 'northfield-trailhand',
      brand: northfield,
      category: mens,
      style: WatchStyle.MULTI_FUNCTION,
      basePrice: 319,
      description: 'A rugged field watch rated to 200m water resistance.',
      image: 'https://placehold.co/800x800/4a4640/faf6f0?text=Northfield+Trailhand',
      variants: [
        { dialColor: 'Olive', strapMaterial: StrapMaterial.SILICONE, stockQuantity: 13 },
        { dialColor: 'Sand', strapMaterial: StrapMaterial.CERAMIC, stockQuantity: 5 },
      ],
    },
    {
      name: 'Aurum & Co. Eclipse',
      slug: 'aurum-eclipse',
      brand: brands[5], // Aurum & Co.
      category: unisex,
      style: WatchStyle.AUTOMATIC,
      basePrice: 499,
      description: 'A sleek automatic watch with a minimalist design.',
      image: 'https://res.cloudinary.com/qiirhuuf/image/upload/f_auto,q_auto/pexels-alexazabache-3766111_aquxvc',
      variants: [
        { dialColor: 'Black', strapMaterial: StrapMaterial.LEATHER, stockQuantity: 10 },
      ],
    },
  ]

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        style: p.style,
        basePrice: p.basePrice,
        brandId: p.brand.id,
        categoryId: p.category.id,
        images: { create: [{ url: p.image, altText: p.name, position: 0 }] },
      },
    })

    for (const v of p.variants) {
      const sku = `${p.slug}-${v.dialColor.toLowerCase()}-${v.strapMaterial.toLowerCase()}`
      await prisma.productVariant.upsert({
        where: { sku },
        update: { stockQuantity: v.stockQuantity },
        create: {
          sku,
          productId: product.id,
          dialColor: v.dialColor,
          strapMaterial: v.strapMaterial,
          stockQuantity: v.stockQuantity,
          status: VariantStatus.ACTIVE,
        },
      })
    }
  }

  console.log(`Seeded ${brands.length} brands and ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { prisma } from '@/lib/prisma'

export interface ProductFilters {
  brands?: string[]
  category?: string
  dialColors?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: 'price-asc' | 'price-desc' | 'newest'
  page?: number
  pageSize?: number
}

export async function getProducts(filters: ProductFilters) {
  const { brands, category, dialColors, minPrice, maxPrice, sort = 'newest', page = 1, pageSize = 24 } = filters

  const where: any = {
    isPublished: true,
    ...(brands?.length ? { brand: { slug: { in: brands } } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { basePrice: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } }
      : {}),
    ...(dialColors?.length ? { variants: { some: { dialColor: { in: dialColors } } } } : {}),
  }

  const orderBy =
    sort === 'price-asc' ? { basePrice: 'asc' as const }
    : sort === 'price-desc' ? { basePrice: 'desc' as const }
    : { createdAt: 'desc' as const }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy, skip: (page - 1) * pageSize, take: pageSize,
      include: { brand: true, images: { orderBy: { position: 'asc' }, take: 1 }, variants: { select: { dialColor: true, stockQuantity: true } } },
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, totalPages: Math.ceil(total / pageSize) }
}

export async function getAllBrands() {
  return prisma.brand.findMany({ orderBy: { name: 'asc' } })
}

export async function getDialColorOptions() {
  const rows = await prisma.productVariant.findMany({
    distinct: ['dialColor'], select: { dialColor: true }, where: { dialColor: { not: null } },
  })
  return rows.map((r) => r.dialColor!).filter(Boolean).sort()
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { brand: true, category: true, images: { orderBy: { position: 'asc' } }, variants: { orderBy: { dialColor: 'asc' } } },
  })
}

export async function getRelatedProducts(brandId: string, excludeProductId: string) {
  return prisma.product.findMany({
    where: { brandId, id: { not: excludeProductId }, isPublished: true },
    take: 4,
    include: { brand: true, images: { orderBy: { position: 'asc' }, take: 1 } },
  })
}

// NEW — real newest products, optionally filtered by category, for the
// homepage New Arrivals tabs
export async function getNewArrivals(categorySlug?: string, take = 8) {
  return prisma.product.findMany({
    where: { isPublished: true, ...(categorySlug ? { category: { slug: categorySlug } } : {}) },
    orderBy: { createdAt: 'desc' },
    take,
    include: { brand: true, images: { orderBy: { position: 'asc' }, take: 1 }, variants: { select: { dialColor: true, stockQuantity: true } } },
  })
}

// NEW — real live product counts per category, shown on the Shop by
// Category cards instead of made-up numbers
export async function getCategoryCounts() {
  const categories = await prisma.category.findMany()
  const counts = await Promise.all(
    categories.map(async (c) => ({
      slug: c.slug,
      name: c.name,
      count: await prisma.product.count({ where: { categoryId: c.id, isPublished: true } }),
    }))
  )
  return counts
}
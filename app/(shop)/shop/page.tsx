import { getProducts, getAllBrands, getDialColorOptions } from '@/lib/products'
import ShopFilters from '@/components/product/ShopFilters'
import ProductCard from '@/components/product/ProductCard'
import SortDropdown from '@/components/product/SortDropdown'
import Pagination from '@/components/product/Pagination'
import Navbar from '@/components/layout/Navbar'

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const sort = (params.sort as 'price-asc' | 'price-desc' | 'newest') || 'newest'

  const [{ products, total, totalPages }, brands, dialColors] = await Promise.all([
    getProducts({
      brands: params.brands?.split(',').filter(Boolean),
      category: params.category || undefined,
      dialColors: params.colors?.split(',').filter(Boolean),
      minPrice: params.min ? Number(params.min) : undefined,
      maxPrice: params.max ? Number(params.max) : undefined,
      sort,
      page,
    }),
    getAllBrands(),
    getDialColorOptions(),
  ])

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-12 pt-32 pb-24">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Shop</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ink">
            {total} {total === 1 ? 'Piece' : 'Pieces'}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <ShopFilters brands={brands} dialColors={dialColors} />

          <div className="flex-1">
            <div className="flex items-center justify-end mb-8">
              <SortDropdown currentSort={sort} />
            </div>

            {products.length === 0 ? (
              <div className="py-24 text-center text-ink-faint">
                No pieces match these filters — try widening your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} searchParams={params} />
          </div>
        </div>
      </main>
    </>
  )
}
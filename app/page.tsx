import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import FeaturedBrands from '@/components/layout/FeaturedBrands'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedBrands />
        {/* Next: Shop by Category */}
      </main>
    </>
  )
}
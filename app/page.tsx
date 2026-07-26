import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import FeaturedBrands from '@/components/layout/FeaturedBrands'
import ShopByCategory from '@/components/layout/ShopByCategory'
import NewArrivals from '@/components/layout/NewArrivals'
import TrustBar from '@/components/layout/TrustBar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedBrands />
        <ShopByCategory />
        <NewArrivals />
        <TrustBar />
      </main>
      <Footer />
    </>
  )
}
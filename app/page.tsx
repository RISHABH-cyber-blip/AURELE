import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import PromoBanner from '@/components/layout/PromoBanner'
import FeaturedBrands from '@/components/layout/FeaturedBrands'
import ShopByCategory from '@/components/layout/ShopByCategory'
import NewArrivals from '@/components/layout/NewArrivals'
import HourglassEdit from '@/components/layout/HourglassEdit'
import TrustBar from '@/components/layout/TrustBar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromoBanner />
        <FeaturedBrands />
        <ShopByCategory />
        <NewArrivals />
        <HourglassEdit />
        <TrustBar />
      </main>
      <Footer />
    </>
  )
}
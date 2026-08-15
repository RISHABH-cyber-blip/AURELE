import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import PromoBanner from '@/components/layout/PromoBanner'
import FeaturedBrands from '@/components/layout/FeaturedBrands'
import ShopByCategory from '@/components/layout/ShopByCategory'
import NewArrivals from '@/components/layout/NewArrivals'
import HourglassEdit from '@/components/layout/HourglassEdit'
import TrustBar from '@/components/layout/TrustBar'
import Footer from '@/components/layout/Footer'

export const revalidate = 60

function SectionSkeleton() {
  return <div className="h-96 animate-pulse bg-cream-soft/40 mx-6 md:mx-16 rounded-2xl my-8" />
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero renders immediately — it's the first thing visible,
            no reason to make visitors wait on database queries for it */}
        <Hero />
        <PromoBanner />
        <FeaturedBrands />

        {/* Sections below the fold stream in independently — each one
            appears as soon as ITS OWN data is ready, instead of the
            whole page waiting on the slowest section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ShopByCategory />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <NewArrivals />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HourglassEdit />
        </Suspense>

        <TrustBar />
      </main>
      <Footer />
    </>
  )
}
'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { CategoriesSection } from '@/components/sections/categories-section'
import { DealsSection } from '@/components/sections/deals-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoriesSection />
        <DealsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}

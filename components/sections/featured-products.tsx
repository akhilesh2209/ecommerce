'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import API from '@/lib/api'
import { ProductCard } from '../product-card'
import { useAppState } from '../app-state-provider'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, bumpCartCount, refreshCartCount } = useAppState()
  const router = useRouter()
  const { ref, visible } = useReveal()

  useEffect(() => {
    API.get('/products/featured/all')
      .then(r => setProducts(r.data || []))
      .catch(e => console.error('Failed to fetch featured products:', e))
      .finally(() => setIsLoading(false))
  }, [])

  const addToCart = async (productId: string) => {
    if (!userId) { toast.error('Please login first'); router.push('/login'); return }
    await API.post('/cart', { userId, productId })
    bumpCartCount(1); refreshCartCount()
    toast.success('Added to cart 🛒')
  }

  const buyNow = async (productId: string) => {
    if (!userId) { toast.error('Please login first'); router.push('/login'); return }
    await API.post('/cart', { userId, productId })
    bumpCartCount(1); refreshCartCount()
    toast.success('Redirecting to checkout...')
    router.push('/checkout')
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(258_90%_66%/0.02)] to-transparent pointer-events-none" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <span className="section-label"><Sparkles className="h-3 w-3" />Featured Collection</span>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-foreground">Our </span>
              <span className="gradient-text">Best Sellers</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">Handpicked products loved by our community — updated weekly with new arrivals and top recommendations.</p>
          </div>
          <Link href="/products" className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-[hsl(258_90%_66%/0.3)] transition-all duration-200 flex-shrink-0">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-96 rounded-3xl bg-[hsl(224_18%_9%)] animate-pulse border border-white/[0.04]" style={{ animationDelay: `${i * 100}ms` }} />
              ))
            : products.map((product, i) => (
                <div
                  key={product._id}
                  className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviews={product.reviews}
                    category={product.category}
                    image={product.images?.[0] || ''}
                    inStock={product.countInStock > 0}
                    onAddToCart={() => addToCart(product._id)}
                    onBuyNow={() => buyNow(product._id)}
                  />
                </div>
              ))
          }
        </div>

        {/* Bottom CTA */}
        {!isLoading && products.length > 0 && (
          <div className={`mt-16 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/products" className="group inline-flex items-center gap-3 btn-primary text-base px-10 py-4 rounded-2xl">
              <Sparkles className="h-5 w-5" />
              Explore All Products
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

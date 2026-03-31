'use client'

import { Star, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { ProductCard } from '../product-card'
import { useAppState } from '../app-state-provider'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, bumpCartCount, refreshCartCount } = useAppState()
  const router = useRouter()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/products')
        // For featured, we can just take the first 4 or those with high rating
        const featured = res.data.slice(0, 4)
        setProducts(featured)
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  const addToCart = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      await API.post("/cart", {
        userId,
        productId,
      })

      bumpCartCount(1)
      refreshCartCount()
      toast.success("Added to cart 🛒")
    } catch (error) {
      console.error(error)
      toast.error("Error adding to cart")
    }
  }

  const buyNow = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Please login first")
        router.push("/login")
        return
      }

      await API.post("/cart", { userId, productId })
      bumpCartCount(1)
      refreshCartCount()
      toast.success("Added to cart. Redirecting to checkout...")
      router.push("/checkout")
    } catch (error) {
      console.error(error)
      toast.error("Failed to proceed to checkout")
    }
  }

  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            FEATURED COLLECTION
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Best Sellers
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Handpicked products loved by our community. Updated weekly with new arrivals and top recommendations.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-xl bg-muted animate-pulse" />
            ))
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                originalPrice={product.price}
                rating={4.5}
                reviews={100}
                category={product.category}
                image={product.image || "📦"}
                inStock={product.countInStock > 0}
                onAddToCart={() => addToCart(product._id)}
                onBuyNow={() => buyNow(product._id)}
              />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

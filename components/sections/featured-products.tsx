'use client'

import { Star, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 324,
    category: 'Electronics',
    image: '🎧',
  },
  {
    id: 2,
    name: 'Luxury Watch Collection',
    price: 599.99,
    originalPrice: 799.99,
    rating: 4.9,
    reviews: 156,
    category: 'Fashion',
    image: '⌚',
  },
  {
    id: 3,
    name: 'Premium Coffee Maker',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 89,
    category: 'Home',
    image: '☕',
  },
  {
    id: 4,
    name: 'Smart Home Hub',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 203,
    category: 'Electronics',
    image: '🏠',
  },
]

export function FeaturedProducts() {
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
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 h-48 flex items-center justify-center">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium text-accent uppercase tracking-wide">
                    {product.category}
                  </p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="ml-auto inline-block rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center space-x-2 group/btn">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
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

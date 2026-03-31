'use client'

import { Star, Heart, ShoppingCart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  onAddToCart?: () => void;
  id: string 
  name: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  category: string
  image: string
  inStock: boolean
  discount?: number
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  category,
  image,
  inStock,
  discount = 0,
  onAddToCart   // ✅ ADD THIS
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 h-56 flex items-center justify-center">
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {image}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 top-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`rounded-full p-2 shadow-subtle transition-all ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-foreground hover:bg-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button className="rounded-full bg-white/90 p-2 shadow-subtle hover:bg-white transition-all">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-wide">
            {category}
          </p>
          <Link href={`/product/${id}`}>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground hover:text-accent transition-colors">
              {name}
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
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">
            ${price}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
  onClick={onAddToCart}
  disabled={!inStock}
  className={`w-full rounded-lg py-3 font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
    inStock
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'bg-muted text-muted-foreground cursor-not-allowed'
  }`}
>
  <ShoppingCart className="h-5 w-5" />
  <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
</button>
      </div>
    </div>
  )
}

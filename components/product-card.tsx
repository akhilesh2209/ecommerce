'use client'

import { Star, Heart, ShoppingCart, Share2, Eye, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'
import { useAppState } from './app-state-provider'

interface ProductCardProps {
  onAddToCart?: () => void
  onBuyNow?: () => void
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

export function ProductCard({ id, name, price, originalPrice, rating, reviews, category, image, inStock, discount = 0, onAddToCart, onBuyNow }: ProductCardProps) {
  const { userId, refreshWishlistCount } = useAppState()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) return
    API.get(`/wishlist/check?userId=${userId}&productId=${id}`)
      .then(r => setIsWishlisted(r.data.isInWishlist))
      .catch(() => {})
  }, [userId, id])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -10
    setTilt({ x, y })
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!userId) { toast.error('Please login to add to wishlist'); return }
    try {
      if (isWishlisted) {
        await API.delete('/wishlist', { data: { userId, productId: id } })
        toast.success('Removed from wishlist')
        setIsWishlisted(false)
      } else {
        await API.post('/wishlist', { userId, productId: id })
        toast.success('Added to wishlist ❤️')
        setIsWishlisted(true)
      }
      refreshWishlistCount()
    } catch { toast.error('Failed to update wishlist') }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!onAddToCart || isAdding) return
    setIsAdding(true)
    try { await onAddToCart() } finally { setIsAdding(false) }
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!onBuyNow || isBuying) return
    setIsBuying(true)
    try { await onBuyNow() } finally { setIsBuying(false) }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/product/${id}`
    if (navigator.share) navigator.share({ title: name, text: `Check out ${name}`, url }).catch(() => navigator.clipboard.writeText(url))
    else navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => toast.error('Failed to copy'))
  }

  const discountPct = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : discount

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-[hsl(224_18%_7%)] transition-all duration-400"
      style={{
        transform: isHovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        boxShadow: isHovered
          ? '0 40px 100px -20px hsl(258 90% 66% / 0.25), 0 0 0 1px hsl(258 90% 66% / 0.1), inset 0 1px 0 hsl(258 90% 66% / 0.08)'
          : '0 4px 20px rgba(0,0,0,0.2)',
        borderColor: isHovered ? 'hsl(258 90% 66% / 0.3)' : undefined,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Gradient shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.04) 0%, transparent 60%)' }} />

      {/* Image area */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(224_18%_10%)] to-[hsl(224_18%_8%)] h-56 flex-shrink-0 flex items-center justify-center">
        {image && image.startsWith('http') ? (
          <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl transition-transform duration-500 group-hover:scale-110">
              {category === 'Electronics' ? '💻' : category === 'Fashion' ? '👗' : category === 'Home' ? '🏠' : '📦'}
            </div>
            <span className="text-xs text-muted-foreground/50 font-medium">{category}</span>
          </div>
        )}

        {/* Floating actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
          <button onClick={toggleWishlist} className={`rounded-xl p-2 shadow-lg backdrop-blur-sm transition-all duration-200 ${isWishlisted ? 'bg-[hsl(327_80%_62%)] text-white shadow-[0_0_15px_hsl(327_80%_62%/0.5)]' : 'bg-[hsl(224_18%_12%/0.9)] text-foreground hover:bg-[hsl(327_80%_62%/0.15)] hover:text-[hsl(327_80%_65%)]'}`}>
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleShare} className="rounded-xl bg-[hsl(224_18%_12%/0.9)] p-2 text-foreground shadow-lg backdrop-blur-sm hover:bg-[hsl(258_90%_66%/0.15)] hover:text-[hsl(258_90%_70%)] transition-all duration-200">
            <Share2 className="h-4 w-4" />
          </button>
          <Link href={`/product/${id}`} className="rounded-xl bg-[hsl(224_18%_12%/0.9)] p-2 text-foreground shadow-lg backdrop-blur-sm hover:bg-[hsl(186_90%_50%/0.15)] hover:text-[hsl(186_90%_55%)] transition-all duration-200">
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discountPct > 0 && (
            <span className="rounded-lg bg-gradient-to-r from-[hsl(327_80%_62%)] to-[hsl(350_85%_65%)] px-2 py-1 text-xs font-bold text-white shadow-[0_0_10px_hsl(327_80%_62%/0.4)]">
              -{discountPct}%
            </span>
          )}
          {!inStock && (
            <span className="rounded-lg bg-black/60 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white/70">Sold Out</span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!inStock && <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[hsl(258_90%_70%)] mb-1">{category}</p>
              <Link href={`/product/${id}`}>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 hover:text-[hsl(258_90%_70%)] transition-colors leading-snug">{name}</h3>
              </Link>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-[hsl(43_96%_56%)] text-[hsl(43_96%_56%)]' : 'fill-white/10 text-white/10'}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">{rating} <span className="text-white/30">·</span> {reviews} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">${price}</span>
            {originalPrice > price && <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>}
            {discountPct > 0 && <span className="text-xs font-semibold text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%/0.1)] px-1.5 py-0.5 rounded-md">Save ${(originalPrice - price).toFixed(0)}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding || isBuying}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all duration-300 ${
              inStock
                ? 'bg-gradient-to-r from-[hsl(258_90%_66%)] to-[hsl(280_85%_65%)] text-white shadow-[0_4px_20px_hsl(258_90%_66%/0.3)] hover:shadow-[0_6px_30px_hsl(258_90%_66%/0.5)] hover:-translate-y-0.5'
                : 'bg-white/5 text-muted-foreground cursor-not-allowed'
            } ${isAdding ? 'opacity-70 scale-95' : ''}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {onBuyNow && inStock && (
            <button
              onClick={handleBuyNow}
              disabled={isAdding || isBuying}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl border border-[hsl(258_90%_66%/0.25)] py-3 text-sm font-semibold text-[hsl(258_90%_70%)] hover:bg-[hsl(258_90%_66%/0.08)] hover:border-[hsl(258_90%_66%/0.5)] transition-all duration-200 ${isBuying ? 'opacity-70' : ''}`}
            >
              <Zap className="h-4 w-4 fill-current" />
              {isBuying ? 'Processing...' : 'Buy Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

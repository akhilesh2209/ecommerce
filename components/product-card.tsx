'use client'

import { Star, Heart, ShoppingCart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'
import { useAppState } from './app-state-provider'

interface ProductCardProps {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
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
  onAddToCart,
  onBuyNow
}: ProductCardProps) {
  const { userId, refreshWishlistCount } = useAppState();
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId) return;
      
      try {
        const res = await API.get(`/wishlist/check?userId=${userId}&productId=${id}`);
        setIsWishlisted(res.data.isInWishlist);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [userId, id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await API.delete("/wishlist", { data: { userId, productId: id } });
        toast.success("Removed from wishlist");
        setIsWishlisted(false);
        refreshWishlistCount();
      } else {
        await API.post("/wishlist", { userId, productId: id });
        toast.success("Added to wishlist ");
        setIsWishlisted(true);
        refreshWishlistCount();
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error(error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!onAddToCart || isAdding) return
    setIsAdding(true)
    try {
      await onAddToCart()
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!onBuyNow || isBuying) return
    setIsBuying(true)
    try {
      await onBuyNow()
    } finally {
      setIsBuying(false)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/product/${id}`;
    const shareText = `Check out ${name} for $${price}!`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: shareText,
        url: shareUrl,
      }).catch((error) => {
        console.log('Error sharing:', error);
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 h-56 flex items-center justify-center flex-shrink-0">
        {image && image.startsWith('http') ? (
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            ????
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-4 top-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleWishlist}
            className={`rounded-full p-2 shadow-subtle transition-all ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-foreground hover:bg-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              handleShare();
            }}
            className="rounded-full bg-white/90 p-2 shadow-subtle hover:bg-white transition-all"
          >
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
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 space-y-4">
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
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding || isBuying}
            className={`w-full rounded-lg py-3 font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
              inStock
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            } ${isAdding ? 'opacity-70' : ''}`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
          
          {onBuyNow && (
            <button
              onClick={handleBuyNow}
              disabled={!inStock || isAdding || isBuying}
              className={`w-full rounded-lg border-2 py-3 font-medium transition-all duration-200 ${
                inStock
                  ? 'border-accent text-accent hover:bg-accent/10'
                  : 'border-muted text-muted-foreground cursor-not-allowed'
              } ${isBuying ? 'opacity-70' : ''}`}
            >
              <span>{isBuying ? 'Processing...' : 'Buy Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

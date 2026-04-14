'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect, useState } from "react"
import API from "@/lib/api"
import { ProductCard } from '@/components/product-card'
import { Heart, ArrowRight, Lock, Sparkles, Star } from 'lucide-react'
import { toast } from "sonner"
import { useAppState } from "@/components/app-state-provider"
import Link from 'next/link'

// ─── Skeleton ─────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="rounded-2xl overflow-hidden opacity-0"
          style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)', animation: `slideUp 0.4s ease ${i * 60}ms forwards` }}>
          <div className="h-56 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="p-4 space-y-3">
            <div className="h-3.5 w-3/4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="h-6 w-1/3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="h-10 w-full rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { userId } = useAppState()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!userId) { setWishlistItems([]); setIsLoading(false); return }
        const res = await API.get(`/wishlist/${userId}`)
        setWishlistItems(res.data)
      } catch (error) {
        toast.error("Failed to load wishlist")
      } finally {
        setIsLoading(false)
      }
    }
    fetchWishlist()
  }, [userId])

  const addToCart = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); return }
      await API.post("/cart", { userId, productId })
      toast.success("Added to cart 🛒")
    } catch (error) {
      toast.error("Error adding to cart")
    }
  }

  const buyNow = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); return }
      await API.post("/cart", { userId, productId })
      toast.success("Redirecting to checkout…")
      window.location.href = "/checkout"
    } catch (error) {
      toast.error("Failed to proceed to checkout")
    }
  }

  // ── Not logged in ──
  if (!userId) return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.06]" style={{ background: 'hsl(258 90% 66%)' }} />
      </div>
      <Navbar />
      <main className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-16 text-center space-y-8"
          style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20" style={{ background: 'hsl(258 90% 66%)', transform: 'scale(1.5)' }} />
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 10%), hsl(270 60% 14%))', border: '1px solid hsl(258 90% 66% / 0.25)' }}>
              <Lock className="w-9 h-9" style={{ color: 'hsl(258 90% 72%)' }} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Sign in to view your wishlist
            </h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Save your favorite products and access them from any device, anytime.
            </p>
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-sm font-bold text-white transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.5)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)' }}>
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04]" style={{ background: 'hsl(327 80% 62%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between opacity-0" style={{ animation: 'slideUp 0.5s ease 50ms forwards' }}>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'hsl(258 90% 72%)' }}>Saved Items</p>
            <h1 className="text-5xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Wishlist</h1>
            {!isLoading && wishlistItems.length > 0 && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            )}
          </div>

          {!isLoading && wishlistItems.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl"
              style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
              <Heart className="w-3.5 h-3.5" style={{ color: 'hsl(327 80% 68%)' }} />
              {wishlistItems.length} saved
            </div>
          )}
        </div>

        {isLoading ? (
          <WishlistSkeleton />
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-0"
            style={{ animation: 'slideUp 0.4s ease 200ms forwards' }}>
            {wishlistItems.map((item, i) => (
              <div key={item._id} className="opacity-0" style={{ animation: `slideUp 0.4s ease ${i * 60}ms forwards` }}>
                <ProductCard
                  id={item.product._id}
                  name={item.product.name}
                  price={item.product.price}
                  originalPrice={item.product.originalPrice || item.product.price}
                  rating={4.5}
                  reviews={100}
                  category={item.product.category}
                  image={item.product.image || ""}
                  inStock={item.product.countInStock > 0}
                  discount={item.product.discount || 0}
                  onAddToCart={() => addToCart(item.product._id)}
                  onBuyNow={() => buyNow(item.product._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="rounded-3xl p-20 text-center space-y-8 opacity-0"
            style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)', animation: 'scIn 0.5s ease 100ms forwards' }}>
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-3xl opacity-20" style={{ background: 'hsl(327 80% 62%)', transform: 'scale(1.5)' }} />
              <div className="relative w-24 h-24 rounded-2xl mx-auto flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(327 80% 10%), hsl(340 60% 14%))',
                  border: '1px solid hsl(327 80% 62% / 0.25)',
                  animation: 'float 5s ease-in-out infinite',
                }}>
                <Heart className="w-10 h-10" style={{ color: 'hsl(327 80% 68%)' }} />
              </div>
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Your wishlist is empty
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Browse our collection and tap the heart icon on products you love to save them here.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: Heart, label: 'Save items' },
                { icon: Sparkles, label: 'Get recommendations' },
                { icon: Star, label: 'Track favorites' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                  <Icon className="w-3 h-3" />{label}
                </span>
              ))}
            </div>

            <Link href="/products"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-sm font-bold text-white transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.5)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)' }}>
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scIn    { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      `}</style>
    </div>
  )
}
'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { ProductCard } from '@/components/product-card'
import { Heart, ArrowRight, Lock } from 'lucide-react'
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";
import Link from 'next/link'

const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1,2,3,4,5,6].map(i => (
      <div key={i} className="card-luxury overflow-hidden">
        <div className="shimmer h-56 w-full" />
        <div className="p-4 space-y-3">
          <div className="shimmer h-4 w-3/4 rounded" />
          <div className="shimmer h-6 w-1/3 rounded" />
          <div className="shimmer h-10 w-full rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default function WishlistPage() {
  const { userId } = useAppState();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!userId) { setWishlistItems([]); setIsLoading(false); return; }
        const res = await API.get(`/wishlist/${userId}`);
        setWishlistItems(res.data);
      } catch (error) {
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  const addToCart = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); return; }
      await API.post("/cart", { userId, productId });
      toast.success("Added to cart 🛒");
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  const buyNow = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); return; }
      await API.post("/cart", { userId, productId });
      toast.success("Redirecting to checkout…");
      window.location.href = "/checkout";
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    }
  };

  if (!userId) return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="card-luxury p-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-foreground">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Save your favorite products and access them from any device.
            </p>
          </div>
          <Link href="/login" className="btn-primary inline-flex px-8 py-3.5">
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 space-y-1 opacity-0 animate-fade-in-up">
          <p className="section-label">Saved Items</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">My Wishlist</h1>
          {!isLoading && wishlistItems.length > 0 && (
            <p className="text-muted-foreground">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        {isLoading ? (
          <WishlistSkeleton />
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-0 animate-fade-in">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item._id}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-6 card-luxury opacity-0 animate-scale-in">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center animate-float">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-2 border-card">
                <span className="text-red-500 text-sm">+</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold text-foreground">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Browse our collection and tap the heart icon on products you love to save them here.
              </p>
            </div>
            <Link href="/products" className="btn-primary inline-flex px-10 py-3.5">
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
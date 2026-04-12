'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { ProductCard } from '@/components/product-card'
import { Heart, ArrowRight } from 'lucide-react'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-state-provider";

export default function WishlistPage() {
  const { userId } = useAppState();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!userId) {
          setWishlistItems([]);
          setIsLoading(false);
          return;
        }

        const res = await API.get(`/wishlist/${userId}`);
        setWishlistItems(res.data);
      } catch (error) {
        toast.error("Failed to load wishlist");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const addToCart = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      await API.post("/cart", {
        userId,
        productId,
      });

      toast.success("Added to cart ");
    } catch (error) {
      console.error(error);
      toast.error("Error adding to cart");
    }
  };

  const buyNow = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      await API.post("/cart", { userId, productId });
      toast.success("Added to cart. Redirecting to checkout...");
      window.location.href = "/checkout";
    } catch (error) {
      console.error(error);
      toast.error("Failed to proceed to checkout");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (!userId) return;

      await API.delete("/wishlist", { data: { userId, productId } });
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item.product._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from wishlist");
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center py-20 space-y-6">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="text-3xl font-bold text-foreground">Login Required</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please login to view and manage your wishlist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">My Wishlist</h1>
          {!isLoading && wishlistItems.length > 0 && (
            <p className="text-muted-foreground">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-muted-foreground">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="text-center py-20 space-y-6 bg-card rounded-xl border border-border/50 shadow-subtle">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start adding products you love to see them here!
              </p>
            </div>
            <a
              href="/products"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

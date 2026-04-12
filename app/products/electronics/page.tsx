'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect } from "react";
import API from "@/lib/api";
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { useState } from 'react'
import { Menu, ArrowUpDown } from 'lucide-react'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-state-provider";

export default function ElectronicsPage() {
  const router = useRouter();
  const { userId, bumpCartCount, refreshCartCount } = useAppState();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        const res = await API.get("/products");
        const electronicsProducts = res.data.filter((product: any) => 
          product.category?.toLowerCase() === 'electronics'
        );
        setProducts(electronicsProducts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load electronics products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectronics();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      await API.post("/cart", {
        userId,
        productId,
      });

      bumpCartCount(1);
      refreshCartCount();
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
        router.push("/login");
        return;
      }

      await API.post("/cart", { userId, productId });
      bumpCartCount(1);
      refreshCartCount();
      toast.success("Added to cart. Redirecting to checkout...");
      router.push("/checkout");
    } catch (error) {
      console.error(error);
      toast.error("Failed to proceed to checkout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="border-b border-border/50 px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Electronics</h1>
          <p className="mt-2 text-muted-foreground">
            Discover our latest collection of electronic gadgets and devices
          </p>
        </div>

        <div className="flex gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-lg border border-border/50 hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 ml-auto">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border/50 bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.price}
                    rating={4.5}
                    reviews={100}
                    category={product.category}
                    image={product.image || ""}
                    inStock={product.countInStock > 0}
                    onAddToCart={() => addToCart(product._id)}
                    onBuyNow={() => buyNow(product._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No electronics products found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {isFiltersOpen && (
          <ProductFilters
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { Menu, ArrowUpDown, Search, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-state-provider";

const ProductSkeleton = () => (
  <div className="card-luxury overflow-hidden">
    <div className="shimmer h-56 w-full" />
    <div className="p-4 space-y-3">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-6 w-1/3 rounded" />
      <div className="flex gap-2">
        <div className="shimmer h-10 flex-1 rounded-lg" />
        <div className="shimmer h-10 flex-1 rounded-lg" />
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const router = useRouter();
  const { userId, bumpCartCount, refreshCartCount } = useAppState();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); router.push("/login"); return; }
      await API.post("/cart", { userId, productId });
      bumpCartCount(1);
      refreshCartCount();
      toast.success("Added to cart 🛒");
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  const buyNow = async (productId: string) => {
    try {
      if (!userId) { toast.error("Please login first"); router.push("/login"); return; }
      await API.post("/cart", { userId, productId });
      bumpCartCount(1);
      refreshCartCount();
      router.push("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="border-b border-border px-4 py-10 sm:px-6 lg:px-8 opacity-0 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="section-label">Catalog</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">All Products</h1>
              <p className="text-muted-foreground">
                Discover {isLoading ? '…' : products.length} premium items
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, categories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-11 pr-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between opacity-0 animate-fade-in delay-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className="lg:hidden btn-outline px-4 py-2.5 text-sm gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                {searchQuery && (
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* View toggle */}
                <div className="flex gap-1 bg-muted rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-sm bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product, i) => (
                  <div key={product._id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}>
                    <ProductCard
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-4 card-luxury opacity-0 animate-scale-in">
                <p className="text-5xl">🔍</p>
                <h3 className="font-display text-2xl font-bold text-foreground">No products found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? `No results for "${searchQuery}". Try a different search.` : 'No products available right now.'}
                </p>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="btn-outline px-6 py-2.5">
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Load More */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="text-center pt-6 opacity-0 animate-fade-in delay-600">
                <button className="btn-outline px-10 py-3.5">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {isFiltersOpen && (
          <ProductFilters isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
}
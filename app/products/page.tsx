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

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 324,
    category: 'Electronics',
    image: '🎧',
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
  },
  {
    id: 5,
    name: 'Designer Sunglasses',
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.5,
    reviews: 142,
    category: 'Fashion',
    image: '😎',
    inStock: true,
  },
  {
    id: 6,
    name: 'Yoga Mat Premium',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.4,
    reviews: 178,
    category: 'Sports',
    image: '🧘',
    inStock: true,
  },
  {
    id: 7,
    name: 'Portable Speaker',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviews: 267,
    category: 'Electronics',
    image: '🔊',
    inStock: true,
  },
  {
    id: 8,
    name: 'Winter Jacket',
    price: 189.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviews: 94,
    category: 'Fashion',
    image: '🧥',
    inStock: false,
  },
  {
    id: 9,
    name: 'LED Desk Lamp',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviews: 156,
    category: 'Home',
    image: '💡',
    inStock: true,
  },
  {
    id: 10,
    name: 'Gaming Mouse',
    price: 69.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviews: 412,
    category: 'Electronics',
    image: '🖱️',
    inStock: true,
  },
  {
    id: 11,
    name: 'Running Shoes',
    price: 139.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 223,
    category: 'Sports',
    image: '👟',
    inStock: true,
  },
  {
    id: 12,
    name: 'Canvas Backpack',
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.5,
    reviews: 178,
    category: 'Fashion',
    image: '🎒',
    inStock: true,
  },
]

export default function ProductsPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProducts();
}, []);

const addToCart = async (productId: string) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    await API.post("/cart", {
      userId,
      productId,
    });

    toast.success("Added to cart 🛒");
  } catch (error) {
    console.error(error);
    alert("Error adding to cart");
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="border-b border-border/50 px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Shop Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our collection of {products.length} premium products
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
  image={product.image || "📦"}
  inStock={product.countInStock > 0}
  onAddToCart={() => addToCart(product._id)}   // 👈 ADD THIS
/>
))}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-8">
              <button className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-200">
                Load More Products
              </button>
            </div>
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

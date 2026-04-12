'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Star, Heart, Share2, ShoppingCart, Truck, RotateCcw, Lock } from 'lucide-react'
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";



const REVIEWS = [
  {
    author: 'John Smith',
    rating: 5,
    date: '2 weeks ago',
    title: 'Best headphones I{"\'"}ve ever owned!',
    text: 'The sound quality is exceptional and they{"\'"}re incredibly comfortable for long listening sessions. Highly recommend!',
  },
  {
    author: 'Sarah Johnson',
    rating: 5,
    date: '1 month ago',
    title: 'Amazing noise cancellation',
    text: 'Perfect for my commute. The ANC works brilliantly and the battery life is outstanding.',
  },
  {
    author: 'Mike Brown',
    rating: 4,
    date: '2 months ago',
    title: 'Great product, minor issues',
    text: 'Love the headphones but wish they came in more colors. Overall very satisfied.',
  },
]

export default function ProductDetailPage() {
  const router = useRouter();
  const { userId, bumpCartCount, refreshCartCount } = useAppState();
  const { id } = useParams();
const [product, setProduct] = useState<any>(null);
const [isActionLoading, setIsActionLoading] = useState(false);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products`);
      
      const found = res.data.find((p: any) => p._id === id);
      setProduct(found);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProduct();
}, [id]);
const addToCart = async () => {
  try {
    if (!userId) {
      toast.error("Please login first");
      router.push("/login");
      return false;
    }

    setIsActionLoading(true);
    for (let i = 0; i < quantity; i += 1) {
      await API.post("/cart", {
        userId,
        productId: product._id, // ✅ REAL ID
      });
    }
    bumpCartCount(quantity);
    refreshCartCount();

    toast.success("Added to cart 🛒");
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Error adding to cart");
    return false;
  } finally {
    setIsActionLoading(false);
  }
};

const buyNow = async () => {
  const added = await addToCart();
  if (added) {
    toast.success("Redirecting to checkout...");
    router.push("/checkout");
  }
};
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-foreground transition-colors">Products</a>
          <span>/</span>
          <span className="text-foreground">{product?.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 h-96 flex items-center justify-center">
              {product?.image && product.image.startsWith('http') ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-8xl">????</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 h-24 flex items-center justify-center hover:ring-2 hover:ring-accent transition-all"
                >
                  {product?.image && product.image.startsWith('http') ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl">????</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
                {product?.category}
              </span>
              <h1 className="text-4xl font-bold text-foreground">
                {product?.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product?.rating || 4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.rating || 4.5} ({product?.reviews || 100} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-foreground">
                  ${product?.price}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${product?.price}
                </span>
                
              </div>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $100
              </p>
            </div>

            {/* Description */}
            <p className="text-foreground/80 leading-relaxed">
              {product?.description}
            </p>

            {/* Options */}
            <div className="space-y-4">
              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Color
                </label>
                <div className="flex space-x-3">
                  {['Black', 'Silver', 'Blue'].map((color) => (
                    <button
                      key={color}
                      className="h-10 w-10 rounded-full border-2 border-border hover:border-accent transition-colors"
                      title={color}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-lg border border-border/50 hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg border border-border/50 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
  onClick={addToCart}
  disabled={isActionLoading}
  className={`w-full rounded-lg bg-primary text-primary-foreground py-4 font-bold text-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center space-x-2 ${
    isActionLoading ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  <ShoppingCart className="h-6 w-6" />
  <span>{isActionLoading ? "Adding..." : "Add to Cart"}</span>
</button>
              <button
                onClick={buyNow}
                disabled={isActionLoading}
                className={`w-full rounded-lg border-2 border-accent text-accent py-4 font-bold text-lg hover:bg-accent/10 transition-all duration-200 ${
                  isActionLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                Buy Now
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 rounded-lg py-3 font-semibold transition-all duration-200 border-2 ${
                    isWishlisted
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400'
                      : 'border-border/50 text-foreground hover:border-accent'
                  }`}
                >
                  <Heart className={`h-5 w-5 mx-auto ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="flex-1 rounded-lg border-2 border-border/50 py-3 font-semibold text-foreground hover:border-accent transition-colors">
                  <Share2 className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
              <div className="flex space-x-3">
                <Truck className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $100</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <RotateCcw className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Easy returns</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Lock className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">SSL encrypted</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <ShoppingCart className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">24/7 Support</p>
                  <p className="text-xs text-muted-foreground">Customer service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Reviews */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          {/* Specs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Specifications</h2>
            <div className="rounded-lg border border-border/50 bg-card">
          {(product?.specs || []).map((spec: any, index: number) => (
  <div
    key={index}
    className={`flex items-center justify-between px-6 py-4 ${
      index !== (product?.specs?.length || 0) - 1
        ? 'border-b border-border/50'
        : ''
    }`}
  >
    <span className="text-muted-foreground">{spec.label}</span>
    <span className="font-semibold text-foreground">{spec.value}</span>
  </div>
))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
            <div className="space-y-4">
              {REVIEWS.map((review, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-card p-6 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {review.title}
                    </p>
                    <p className="text-sm text-foreground/80 mt-1">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Star, Heart, Share2, ShoppingCart, Truck, RotateCcw, Lock, Check, ArrowLeft, Minus, Plus } from 'lucide-react'
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";
import Link from 'next/link'

const REVIEWS = [
  { author: 'Jonathan M.', rating: 5, date: '2 weeks ago', title: 'Best purchase I have made all year', text: 'The quality is exceptional. Every detail has been thought through. Will definitely be recommending to friends.', avatar: '🧑‍💼' },
  { author: 'Sarah K.',    rating: 5, date: '1 month ago',  title: 'Exceeded my expectations completely', text: 'Outstanding experience from purchase to delivery. The product itself is premium quality and looks even better in person.', avatar: '👩‍💻' },
  { author: 'Marcus L.',  rating: 4, date: '2 months ago', title: 'Great product, minor quibbles', text: 'Very happy overall. Would have loved more color options, but the quality is unquestionable.', avatar: '👨‍🎨' },
]

const ProductSkeleton = () => (
  <div className="grid gap-12 lg:grid-cols-2 animate-fade-in">
    <div className="space-y-4">
      <div className="shimmer h-96 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => <div key={i} className="shimmer h-24 rounded-xl" />)}
      </div>
    </div>
    <div className="space-y-6">
      <div className="shimmer h-8 w-24 rounded-full" />
      <div className="shimmer h-10 w-3/4 rounded" />
      <div className="shimmer h-4 w-40 rounded" />
      <div className="shimmer h-12 w-32 rounded" />
      <div className="shimmer h-20 w-full rounded" />
      <div className="shimmer h-12 w-full rounded-xl" />
    </div>
  </div>
)

export default function ProductDetailPage() {
  const router = useRouter();
  const { userId, bumpCartCount, refreshCartCount } = useAppState();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products`);
        const found = res.data.find((p: any) => p._id === id);
        setProduct(found);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      if (!userId) { toast.error("Please login first"); router.push("/login"); return false; }
      setIsActionLoading(true);
      for (let i = 0; i < quantity; i++) {
        await API.post("/cart", { userId, productId: product._id });
      }
      bumpCartCount(quantity);
      refreshCartCount();
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart 🛒`);
      return true;
    } catch (error) {
      toast.error("Error adding to cart");
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const buyNow = async () => {
    const added = await addToCart();
    if (added) router.push("/checkout");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 shimmer h-4 w-48 rounded" />
        <ProductSkeleton />
      </main>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-6xl">🔍</p>
        <h2 className="font-display text-2xl font-bold">Product not found</h2>
        <Link href="/products" className="btn-primary inline-flex px-6 py-3">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground opacity-0 animate-fade-in">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product?.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4 opacity-0 animate-fade-in-up">
            <div className="relative overflow-hidden rounded-2xl bg-warm-gradient h-96 md:h-[480px] border border-border">
              {product?.image && product.image.startsWith('http') ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover hover-scale transition-transform duration-700" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-8xl animate-float">🛍️</div>
              )}
              {/* Wishlist button overlay */}
              <button
                onClick={() => { setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️"); }}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 ${
                  isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'bg-white/80 border-white/50 text-foreground hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(i => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`overflow-hidden rounded-xl bg-warm-gradient h-24 flex items-center justify-center border-2 transition-all duration-200 ${
                    selectedImage === i ? 'border-accent shadow-lg' : 'border-border hover:border-accent/50'
                  }`}
                >
                  {product?.image && product.image.startsWith('http') ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">🛍️</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-7 opacity-0 animate-fade-in-up delay-200">
            {/* Category & Name */}
            <div className="space-y-3">
              <span className="badge badge-accent">{product?.category}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {product?.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product?.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product?.rating || 4.5} · {product?.reviews || 100} reviews</span>
                <div className="h-1 w-1 rounded-full bg-border" />
                <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In stock
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-foreground">${product?.price}</span>
                {product?.originalPrice && product.originalPrice !== product.price && (
                  <span className="text-xl text-muted-foreground line-through">${product?.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-green-500 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Free shipping on this order
              </p>
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed border-t border-border pt-6">
              {product?.description || "Premium quality product, carefully crafted for exceptional performance and longevity."}
            </p>

            {/* Color Selection */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Color <span className="text-muted-foreground font-normal">— Midnight Black</span></p>
              <div className="flex gap-2">
                {[
                  { color: '#1a1a1a', name: 'Black' },
                  { color: '#c0c0c0', name: 'Silver' },
                  { color: '#1a3a6b', name: 'Navy' },
                ].map(({ color, name }, i) => (
                  <button
                    key={name}
                    title={name}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${i === 0 ? 'border-accent shadow-md' : 'border-border hover:border-accent/50'}`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Quantity</p>
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-card transition-all">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-card transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={addToCart}
                disabled={isActionLoading}
                className="btn-primary w-full py-4 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Adding…</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </button>
              <button
                onClick={buyNow}
                disabled={isActionLoading}
                className="btn-accent w-full py-4 text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist"); }}
                  className={`btn-outline py-3 justify-center gap-2 ${isWishlisted ? 'text-red-500 border-red-500/30 bg-red-50' : ''}`}>
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Wishlist'}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                  className="btn-outline py-3 justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, title: 'Free Shipping', sub: 'Orders over $100' },
                { icon: RotateCcw, title: '30-Day Returns', sub: 'Hassle-free returns' },
                { icon: Lock, title: 'Secure Checkout', sub: '256-bit SSL' },
                { icon: ShoppingCart, title: '24/7 Support', sub: 'Always here to help' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs & Reviews */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          {/* Specs */}
          <div className="space-y-5 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
              <p className="section-label">Details</p>
              <h2 className="font-display text-2xl font-bold text-foreground">Specifications</h2>
            </div>
            <div className="card-luxury overflow-hidden">
              {(product?.specs || []).length > 0 ? (
                product.specs.map((spec: any, i: number) => (
                  <div key={i} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-muted/30' : ''} ${i !== product.specs.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <span className="text-sm text-muted-foreground">{spec.label}</span>
                    <span className="text-sm font-semibold text-foreground">{spec.value}</span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  No specifications available
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-5 opacity-0 animate-fade-in-up delay-200">
            <div className="space-y-2">
              <p className="section-label">Feedback</p>
              <h2 className="font-display text-2xl font-bold text-foreground">Customer Reviews</h2>
            </div>
            <div className="space-y-4">
              {REVIEWS.map((review, i) => (
                <div key={i} className="card-luxury p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-warm-gradient flex items-center justify-center text-xl">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.text}</p>
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
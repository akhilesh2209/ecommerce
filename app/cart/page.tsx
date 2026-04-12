'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect } from "react";
import API from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, Gift, ShoppingBag, Tag, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";

const CartSkeleton = () => (
  <div className="grid gap-12 lg:grid-cols-3">
    <div className="lg:col-span-2 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-6 rounded-2xl border border-border p-6">
          <div className="shimmer h-28 w-28 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="shimmer h-5 w-3/4 rounded" />
            <div className="shimmer h-4 w-1/4 rounded" />
            <div className="shimmer h-8 w-28 rounded-lg mt-4" />
          </div>
        </div>
      ))}
    </div>
    <div className="shimmer h-80 rounded-2xl" />
  </div>
);

export default function CartPage() {
  const { userId, setCartCountFromItems } = useAppState();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          setItems([]);
          setCartCountFromItems([]);
          setIsLoadingCart(false);
          return;
        }
        const res = await API.get(`/cart/${userId}`);
        setItems(res.data);
        setCartCountFromItems(res.data || []);
      } catch (error) {
        toast.error("Failed to load cart");
      } finally {
        setIsLoadingCart(false);
      }
    };
    fetchCart();
  }, [userId, setCartCountFromItems]);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal + tax + shipping - promoDiscount;

  const applyPromo = () => {
    if (promoApplied) { toast.info("Promo already applied"); return; }
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1);
      setPromoApplied(true);
      toast.success("🎉 Promo code applied! 10% discount");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (isUpdating) return;
    const qty = Number(newQuantity);
    if (qty < 0) return;
    setIsUpdating(true);
    try {
      const res = await API.put("/cart", { cartId: id, quantity: qty });
      if (res.data?.message === "Item removed" || qty === 0) {
        const next = items.filter((item) => item._id !== id);
        setItems(next);
        setCartCountFromItems(next);
        toast.success("Item removed from cart");
      } else {
        const next = items.map((item) => item._id === id ? { ...item, quantity: res.data.quantity } : item);
        setItems(next);
        setCartCountFromItems(next);
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <p className="section-label mb-2">My Shopping</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Your Cart
          </h1>
          {!isLoadingCart && items.length > 0 && (
            <p className="mt-2 text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} · Est. delivery in 3–5 days
            </p>
          )}
        </div>

        {isLoadingCart ? (
          <CartSkeleton />
        ) : items.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <div
                  key={item._id}
                  className="card-luxury p-5 flex gap-5 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Image */}
                  <div className="h-28 w-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
                    {item.product?.image && item.product.image.startsWith('http') ? (
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover hover-scale" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl bg-warm-gradient">🛍️</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">{item.product?.name || "Product"}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.product?.category || "Item"}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-foreground">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">${item.product?.price} each</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card disabled:opacity-40 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card disabled:opacity-40 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => updateQuantity(item._id, 0)}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive disabled:opacity-40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Truck, text: "Free shipping over $100" },
                  { icon: Shield, text: "Secure checkout" },
                  { icon: Gift, text: "Free gift wrapping" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
                    <Icon className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 opacity-0 animate-slide-in-right delay-200">
              {/* Promo */}
              <div className="card-luxury p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-foreground">Promo Code</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code…"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="input-luxury flex-1 text-sm py-2.5"
                    disabled={promoApplied}
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoApplied}
                    className="btn-accent px-4 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {promoApplied ? "✓" : "Apply"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-accent font-mono font-medium">SAVE10</span> — get 10% off your order
                </p>
              </div>

              {/* Order Summary */}
              <div className="card-luxury p-5 space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground">Order Summary</h3>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount (10%)</span>
                      <span>−${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-bold text-foreground text-lg">Total</span>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-accent">${total.toFixed(2)}</p>
                    {promoDiscount > 0 && (
                      <p className="text-xs text-green-600">You save ${promoDiscount.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full py-3.5 text-base justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/products"
                  className="btn-outline w-full py-3 text-sm justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 space-y-6 opacity-0 animate-scale-in">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center animate-float">
                <ShoppingBag className="w-14 h-14 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center animate-pulse-glow">
                <Plus className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-display text-3xl font-bold text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Looks like you haven't added anything yet. Discover our curated collection and find something you'll love.
              </p>
            </div>
            <Link href="/products" className="btn-primary px-10 py-3.5 text-base">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
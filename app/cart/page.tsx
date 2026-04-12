'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect } from "react";
import API from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, Gift, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";

export default function CartPage() {
  const { userId, setCartCountFromItems } = useAppState();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

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
        console.error(error);
      } finally {
        setIsLoadingCart(false);
      }
    };

    fetchCart();
  }, [userId, setCartCountFromItems]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15
  const total = subtotal + tax + shipping - promoDiscount

  const applyPromo = () => {
    if (promoCode === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1)
      toast.success("Promo applied: 10% discount");
    } else {
      toast.error("Invalid promo code");
    }
  }

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      if (isUpdating) return;
      
      const qty = Number(newQuantity);
      if (qty < 0) return;

      setIsUpdating(true);

      const res = await API.put("/cart", {
        cartId: id,
        quantity: qty,
      });

      if (res.data?.message === "Item removed" || qty === 0) {
        const next = items.filter((item) => item._id !== id);
        setItems(next);
        setCartCountFromItems(next);
        toast.success("Item removed from cart");
      } else {
        const next = items.map((item) =>
          item._id === id ? { ...item, quantity: res.data.quantity } : item
        );
        setItems(next);
        setCartCountFromItems(next);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          {!isLoadingCart && items.length > 0 && (
            <p className="mt-2 text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {isLoadingCart ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-muted-foreground">Loading your cart...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-6 rounded-lg border border-border/50 bg-card p-6 hover:shadow-subtle transition-shadow"
                >
                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                    {item.product?.image && item.product.image.startsWith('http') ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">
                        ???
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{item.product?.name || "Product"}</h3>
                    <p className="text-2xl font-bold text-accent">${item.product?.price || 0}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-center"
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-50 transition-colors flex items-center justify-center"
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-lg font-bold text-foreground">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => updateQuantity(item._id, 0)}
                      className="text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                <h3 className="font-semibold text-foreground">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 rounded-lg border border-border/50 bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={applyPromo}
                    className="rounded-lg bg-accent text-accent-foreground px-4 py-2 font-medium hover:bg-accent/90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Try "SAVE10" for 10% off</p>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Order Summary</h3>

                <div className="space-y-2 border-b border-border/50 pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? (
                        <span className="text-green-500 font-medium">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-500 font-medium">
                      <span>Discount</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/products"
                  className="w-full rounded-lg border-2 border-border/50 text-foreground py-3 font-semibold hover:border-accent transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Benefits */}
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-6 space-y-3">
                <div className="flex space-x-3">
                  <Gift className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Free Gift Wrap</p>
                    <p className="text-xs text-muted-foreground">Available for all items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 space-y-6 bg-card rounded-xl border border-border/50 shadow-subtle">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Looks like you haven{"'"}t added anything to your cart yet. Explore our latest products and find something you love!
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

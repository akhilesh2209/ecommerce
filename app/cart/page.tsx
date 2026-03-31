'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect } from "react";
import API from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, Gift } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const CART_ITEMS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    quantity: 1,
    image: '🎧',
  },
  {
    id: 2,
    name: 'Smart Home Hub',
    price: 149.99,
    quantity: 2,
    image: '🏠',
  },
  {
    id: 3,
    name: 'LED Desk Lamp',
    price: 49.99,
    quantity: 1,
    image: '💡',
  },
]

export default function CartPage() {

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId"); // we’ll fix this below

      if (!userId) return;

      const res = await API.get(`/cart/${userId}`);
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchCart();
}, []);

  const [items, setItems] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

  const subtotal = items.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
)
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping - promoDiscount

  const applyPromo = () => {
    if (promoCode === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1)
    }
  }

const updateQuantity = async (id: string, newQuantity: number) => {
  try {
    if (newQuantity <= 0) {
      await API.put("/cart", {
        cartId: id,
        quantity: 0,
      });

      setItems(items.filter((item) => item._id !== id));
    } else {
      const res = await API.put("/cart", {
        cartId: id,
        quantity: newQuantity,
      });

      setItems(
        items.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-6 rounded-lg border border-border/50 bg-card p-6 hover:shadow-subtle transition-shadow"
                >
                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl">
                    {item.product.image}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{item.product.name}</h3>
<p className="text-2xl font-bold text-accent">${item.product.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted transition-colors flex items-center justify-center"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-lg font-bold text-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => updateQuantity(item._id, 0)}
                      className="text-red-500 hover:text-red-600 transition-colors"
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

                <button className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <Link
                  href="/products"
                  className="w-full rounded-lg border-2 border-border/50 text-foreground py-3 font-semibold hover:border-accent transition-colors text-center"
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
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl">🛒</div>
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

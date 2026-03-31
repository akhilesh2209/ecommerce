'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import { useAppState } from "@/components/app-state-provider";

type OrderItem = {
  name: string
  price: number
  quantity: number
}

type Order = {
  _id: string
  status: string
  subtotal: number
  tax: number
  shipping: number
  totalPrice: number
  items: OrderItem[]
  createdAt: string
}

export default function OrdersPage() {
  const { userId } = useAppState();
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) {
          toast.error("Please login to view your orders");
          setOrders([]);
          return;
        }

        const res = await API.get(`/orders/${userId}`);
        setOrders(res.data);
      } catch (error) {
        toast.error("Failed to load orders");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Your Orders</h1>
          <p className="text-muted-foreground">
            Track purchases and review order details.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-border/50 bg-card p-6">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">No orders yet</h2>
            <p className="text-muted-foreground">
              Place an order to see it here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span className="font-semibold text-foreground">Order {order._id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Status: {order.status} • {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-accent">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-semibold text-foreground mb-3">Items</h3>
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={`${it.name}-${idx}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {it.name} × {it.quantity}
                        </span>
                        <span className="text-foreground">
                          ${(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm pt-2">
                  <div className="rounded-md border border-border/50 bg-background p-3">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-semibold text-foreground">${order.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="rounded-md border border-border/50 bg-background p-3">
                    <p className="text-muted-foreground">Tax</p>
                    <p className="font-semibold text-foreground">${order.tax.toFixed(2)}</p>
                  </div>
                  <div className="rounded-md border border-border/50 bg-background p-3">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-semibold text-foreground">${order.shipping.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


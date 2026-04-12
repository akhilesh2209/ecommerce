'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, ShoppingCart, Package, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { useAppState } from "@/components/app-state-provider";

type OrderItem = { name: string; price: number; quantity: number }
type Order = {
  _id: string; status: string; subtotal: number; tax: number;
  shipping: number; totalPrice: number; items: OrderItem[]; createdAt: string;
}

const OrderSkeleton = () => (
  <div className="space-y-4">
    {[1,2,3].map(i => (
      <div key={i} className="card-luxury p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="shimmer h-5 w-48 rounded" />
            <div className="shimmer h-4 w-32 rounded" />
          </div>
          <div className="shimmer h-7 w-24 rounded-full" />
        </div>
        <div className="shimmer h-px w-full" />
        <div className="space-y-2">
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-3/4 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const statusConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  delivered:  { label: "Delivered",  class: "status-delivered",  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  shipped:    { label: "Shipped",    class: "status-shipped",    icon: <Package className="w-3.5 h-3.5" /> },
  processing: { label: "Processing", class: "status-processing", icon: <Clock className="w-3.5 h-3.5" /> },
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const statusKey = order.status?.toLowerCase() || "processing";
  const status = statusConfig[statusKey] || statusConfig["processing"];

  return (
    <div className="card-luxury overflow-hidden opacity-0 animate-fade-in-up">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              <span className="font-mono-custom text-sm font-medium text-foreground">
                #{order._id.toString().slice(-10).toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${status.class} flex items-center gap-1.5`}>
              {status.icon}
              {status.label}
            </span>
            <p className="font-display text-xl font-bold text-accent">${order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Items preview */}
        <div className="mt-4 flex flex-wrap gap-2">
          {order.items.slice(0, 3).map((it, idx) => (
            <span key={idx} className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-lg">
              {it.name} × {it.quantity}
            </span>
          ))}
          {order.items.length > 3 && (
            <span className="text-xs text-accent font-medium px-2 py-1.5">
              +{order.items.length - 3} more
            </span>
          )}
        </div>

        {/* Toggle expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? "Hide details" : "View details"}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border animate-fade-in">
          {/* All items */}
          <div className="p-6 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Items</h4>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={`${it.name}-${idx}`} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-foreground font-medium">{it.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">× {it.quantity}</span>
                    <span className="font-semibold text-foreground">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Subtotal", value: `$${order.subtotal?.toFixed(2) || "—"}` },
                { label: "Tax", value: `$${order.tax?.toFixed(2) || "—"}` },
                { label: "Shipping", value: order.shipping === 0 ? "Free" : `$${order.shipping?.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
        setOrders(res.data.orders || []);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between opacity-0 animate-fade-in-up">
          <div className="space-y-1">
            <p className="section-label">History</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Your Orders</h1>
            {!isLoading && orders.length > 0 && (
              <p className="text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            )}
          </div>
          {!isLoading && orders.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-xl">
              <Package className="w-4 h-4 text-accent" />
              All orders
            </div>
          )}
        </div>

        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="text-center py-24 space-y-6 card-luxury opacity-0 animate-scale-in">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center animate-float">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold text-foreground">No orders yet</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                When you place your first order, it'll appear here. Ready to start shopping?
              </p>
            </div>
            <Link href="/products" className="btn-primary inline-flex px-8 py-3.5">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={order._id} style={{ animationDelay: `${i * 80}ms` }}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
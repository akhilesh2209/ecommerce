"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Eye, Package, TrendingUp, Star, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import API from "@/lib/api";
import { useAppState } from "@/components/app-state-provider";
import { toast } from "sonner";

type DashboardTab = 'overview' | 'orders' | 'wishlist' | 'profile'

const StatCard = ({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) => (
  <div className="card-luxury p-6 space-y-3">
    <p className="text-sm text-muted-foreground font-medium">{label}</p>
    <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
    <p className={`text-xs ${color === 'text-foreground' ? 'text-accent' : 'text-muted-foreground'}`}>{sub}</p>
  </div>
);

const OrderSkeleton = () => (
  <div className="space-y-3">
    {[1,2,3].map(i => (
      <div key={i} className="card-luxury p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="shimmer w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <div className="shimmer h-4 w-36 rounded" />
            <div className="shimmer h-3 w-24 rounded" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="shimmer h-5 w-20 rounded" />
          <div className="shimmer h-5 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default function DashboardPage() {
  const { userId, isAuthenticated, logout } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    const fetchOrders = async () => {
      try {
        if (userId) {
          const res = await API.get(`/orders/${userId}`);
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, userId, router]);

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  if (!isAuthenticated) return null;

  const navItems = [
    { id: 'overview', label: 'Overview',         icon: Eye },
    { id: 'orders',   label: 'My Orders',        icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist',          icon: Heart },
    { id: 'profile',  label: 'Profile Settings',  icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-luxury overflow-hidden sticky top-20">
              {/* Profile header */}
              <div className="relative p-6 pb-8 overflow-hidden" style={{
                background: 'linear-gradient(135deg, hsl(20 15% 12%) 0%, hsl(25 15% 18%) 100%)',
              }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/10 -translate-y-1/2 translate-x-1/2" />
                <div className="relative space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {userId ? userId.toString()[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">My Account</h3>
                    <p className="text-xs text-white/50 font-mono-custom mt-0.5 truncate">{userId}</p>
                  </div>
                  <span className="badge badge-accent text-xs">Premium Member</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
                  </button>
                ))}
              </nav>

              <div className="p-2 border-t border-border mt-2">
                <button
                  onClick={() => { logout(); router.push("/login"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div>
                  <p className="section-label mb-1">Dashboard</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">Overview</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Total Orders" value={String(orders.length)} sub="Lifetime purchases" color="text-foreground" />
                  <StatCard label="Total Spent" value={`$${totalSpent.toFixed(2)}`} sub="Across all orders" color="text-foreground" />
                  <StatCard label="Reward Points" value={String(Math.floor(totalSpent))} sub="Redeem for discounts" color="text-accent" />
                </div>

                {/* Recent orders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-foreground">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-accent flex items-center gap-1 hover:gap-2 transition-all">
                      View all <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  {isLoading ? <OrderSkeleton /> : orders.length === 0 ? (
                    <div className="card-luxury p-10 text-center space-y-3">
                      <Package className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">No orders yet.</p>
                      <Link href="/products" className="btn-accent inline-flex px-6 py-2.5 text-sm">Browse Products</Link>
                    </div>
                  ) : orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="card-luxury p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-warm-gradient flex items-center justify-center text-2xl">📦</div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">${order.totalPrice.toFixed(2)}</p>
                        <span className="badge badge-success text-xs mt-1">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4 opacity-0 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-label mb-1">History</p>
                    <h2 className="font-display text-3xl font-bold text-foreground">Order History</h2>
                  </div>
                  <Link href="/orders" className="btn-outline px-4 py-2 text-sm">
                    Detailed view <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                {isLoading ? <OrderSkeleton /> : orders.length === 0 ? (
                  <div className="card-luxury p-16 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
                    <h3 className="font-display text-xl font-bold text-foreground">No orders yet</h3>
                    <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                    <Link href="/products" className="btn-primary inline-flex px-8 py-3">Start Shopping</Link>
                  </div>
                ) : orders.map((order) => (
                  <div key={order._id} className="card-luxury p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-foreground">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="badge badge-success">{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                      <div className="flex items-center gap-4">
                        <p className="font-display text-xl font-bold text-accent">${order.totalPrice.toFixed(2)}</p>
                        <Link href="/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
                          Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4 opacity-0 animate-fade-in-up">
                <div>
                  <p className="section-label mb-1">Saved</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">Wishlist</h2>
                </div>
                <div className="card-luxury p-16 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto animate-float">
                    <Heart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">No saved items</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Browse products and tap the heart icon to save items you love.
                  </p>
                  <Link href="/products" className="btn-primary inline-flex px-8 py-3">
                    Browse Products
                  </Link>
                </div>
              </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl opacity-0 animate-fade-in-up">
                <div>
                  <p className="section-label mb-1">Settings</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">Profile</h2>
                </div>

                <div className="card-luxury p-6 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">User ID</label>
                    <input
                      type="text"
                      disabled
                      value={userId || ""}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground font-mono-custom text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Your unique identifier — this cannot be changed.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Account Status</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-green-700 font-medium">Active & Verified</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Membership</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground font-medium">Premium Member</span>
                      <span className="ml-auto badge badge-accent">Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.info("Profile updates are handled via account registration.")}
                    className="btn-primary w-full py-3.5"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
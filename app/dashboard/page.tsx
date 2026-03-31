"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import API from "@/lib/api";
import { useAppState } from "@/components/app-state-provider";
import { toast } from "sonner";

type DashboardTab = 'overview' | 'orders' | 'wishlist' | 'profile'

export default function DashboardPage() {
  const { userId, isAuthenticated, logout } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border/50 bg-card overflow-hidden sticky top-20">
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {userId ? "U" : "G"}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">User Dashboard</h3>
                  <p className="text-sm text-muted-foreground truncate">{userId}</p>
                </div>
                <div className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  Member
                </div>
              </div>

              {/* Navigation */}
              <nav className="divide-y divide-border/50">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'profile', label: 'Profile Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <button 
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full flex items-center space-x-3 px-6 py-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-border/50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">{orders.length}</p>
                    <p className="text-xs text-accent">Real-time update</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-3xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-accent">Across all purchases</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Rewards Points</p>
                    <p className="text-3xl font-bold text-accent">{Math.floor(totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Redeem for discounts</p>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">Recent Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-accent hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="h-20 bg-muted animate-pulse rounded-lg" />
                    ) : orders.length === 0 ? (
                      <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                        No orders yet.
                      </div>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                        <div
                          key={order._id}
                          className="rounded-lg border border-border/50 bg-card p-4 flex items-center justify-between hover:shadow-subtle transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl">
                              📦
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Order #{order._id.toString().slice(-8)}</p>
                              <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${order.totalPrice.toFixed(2)}</p>
                            <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Order History</h2>
                  <Link href="/orders" className="text-accent hover:underline text-sm font-medium">View Detailed History</Link>
                </div>
                <div className="space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                    ))
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center border border-dashed rounded-lg space-y-4">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">You haven{"'"}t placed any orders yet.</p>
                      <Link href="/products" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg">Start Shopping</Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-lg border border-border/50 bg-card p-6 hover:shadow-subtle transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-foreground">Order #{order._id.toString().slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">📦</div>
                            <p className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">${order.totalPrice.toFixed(2)}</p>
                            <Link
                              href="/orders"
                              className="text-sm text-accent hover:underline flex items-center space-x-1"
                            >
                              <span>View Details</span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Your Wishlist</h2>
                <div className="p-12 text-center border border-dashed rounded-lg space-y-4">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Your wishlist is currently empty.</p>
                  <Link href="/products" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg">Browse Products</Link>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userId || ""}
                      className="w-full rounded-lg border border-border/50 bg-muted px-4 py-3 text-foreground opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Status
                    </label>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                      Your account is active and verified.
                    </div>
                  </div>

                  <button 
                    onClick={() => toast.info("Profile updates are handled via registration.")}
                    className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors"
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
  )
}

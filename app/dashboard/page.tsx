"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type DashboardTab = 'overview' | 'orders' | 'wishlist' | 'profile'

const USER_PROFILE = {
  name: 'Sarah Anderson',
  email: 'sarah.anderson@example.com',
  phone: '+1 (555) 123-4567',
  memberSince: 'January 2023',
  tier: 'Premium',
}

const USER_ORDERS = [
  {
    id: 'PrimeStore-2024-001234',
    date: '2024-03-20',
    total: 809.96,
    status: 'Delivered',
    items: 3,
    image: '🎧',
  },
  {
    id: 'PrimeStore-2024-001200',
    date: '2024-03-10',
    total: 149.99,
    status: 'Delivered',
    items: 1,
    image: '🏠',
  },
  {
    id: 'PrimeStore-2024-001156',
    date: '2024-02-28',
    total: 249.99,
    status: 'Delivered',
    items: 1,
    image: '💡',
  },
]

const WISHLIST_ITEMS = [
  {
    id: 1,
    name: 'Premium Laptop',
    price: 1299.99,
    rating: 4.9,
    reviews: 856,
    image: '💻',
    inStock: true,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: 199.99,
    rating: 4.8,
    reviews: 342,
    image: '⌨️',
    inStock: true,
  },
  {
    id: 3,
    name: '4K Webcam',
    price: 299.99,
    rating: 4.6,
    reviews: 128,
    image: '📹',
    inStock: false,
  },
]

export default function DashboardPage() {

  const isAuthenticated = useAuth();
const router = useRouter();

useEffect(() => {
  if (!isAuthenticated) {
    router.push("/login");
  }
}, [isAuthenticated]);

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

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
                  SA
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{USER_PROFILE.name}</h3>
                  <p className="text-sm text-muted-foreground">{USER_PROFILE.email}</p>
                </div>
                <div className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  {USER_PROFILE.tier} Member
                </div>
              </div>

              {/* Navigation */}
              <nav className="divide-y divide-border/50">
                {[
                  { id: 'overview', label: 'Overview', icon: ShoppingBag },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
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
              <button className="w-full flex items-center space-x-3 px-6 py-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-border/50">
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
                <h2 className="text-2xl font-bold text-foreground">Welcome back, {USER_PROFILE.name}!</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">24</p>
                    <p className="text-xs text-accent">Member since {USER_PROFILE.memberSince}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-3xl font-bold text-foreground">$2,847.50</p>
                    <p className="text-xs text-accent">Across all purchases</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Rewards Points</p>
                    <p className="text-3xl font-bold text-accent">2,847</p>
                    <p className="text-xs text-muted-foreground">Redeem for discounts</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">Recent Orders</h3>
                    <Link
                      href="#orders"
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-accent hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {USER_ORDERS.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-border/50 bg-card p-4 flex items-center justify-between hover:shadow-subtle transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl">
                            {order.image}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${order.total}</p>
                          <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Your Orders</h2>
                <div className="space-y-3">
                  {USER_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-border/50 bg-card p-6 hover:shadow-subtle transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold text-foreground">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{order.image}</div>
                          <p className="text-sm text-muted-foreground">{order.items} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">${order.total}</p>
                          <Link
                            href={`/order/${order.id}`}
                            className="text-sm text-accent hover:underline flex items-center space-x-1"
                          >
                            <span>View Details</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Your Wishlist</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {WISHLIST_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border/50 bg-card overflow-hidden hover:shadow-elevation transition-shadow"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-5xl">
                        {item.image}
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(item.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground">
                            ({item.reviews})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-foreground">
                            ${item.price}
                          </p>
                          {!item.inStock && (
                            <span className="text-xs text-red-500 font-medium">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <button
                          disabled={!item.inStock}
                          className={`w-full rounded-lg py-2 font-medium transition-colors ${
                            item.inStock
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {item.inStock ? 'Add to Cart' : 'Notify Me'}
                        </button>
                      </div>
                    </div>
                  ))}
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={USER_PROFILE.name}
                      className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={USER_PROFILE.email}
                      className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={USER_PROFILE.phone}
                      className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <button className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors">
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

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Eye, Package, TrendingUp, Star, Clock, ArrowUpRight, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import API from "@/lib/api"
import { useAppState } from "@/components/app-state-provider"
import { toast } from "sonner"

type DashboardTab = 'overview' | 'orders' | 'wishlist' | 'profile'

// ─── Stat card ────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="group relative rounded-2xl p-6 space-y-3 overflow-hidden cursor-default transition-all duration-300"
      style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${accent}40`; el.style.boxShadow = `0 0 40px ${accent}10`; el.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${accent}08, transparent 70%)` }} />
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: accent }}>{value}</p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="space-y-2">
              <div className="h-3.5 w-36 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-3 w-24 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-20 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="h-5 w-16 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase()
  const config = s === 'delivered'
    ? { color: 'rgb(110,231,183)', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' }
    : s === 'shipped'
    ? { color: 'rgb(167,139,250)', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' }
    : { color: 'rgb(251,191,36)',  bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.color }} />
      {status}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { userId, isAuthenticated, logout } = useAppState()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    const fetchOrders = async () => {
      try {
        if (userId) {
          const res = await API.get(`/orders/${userId}`)
          const ordersData = Array.isArray(res.data) ? res.data : []
          setOrders(ordersData)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated, userId, router])

  const totalSpent = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) : 0
  if (!isAuthenticated) return null

  const navItems = [
    { id: 'overview', label: 'Overview',         icon: Eye },
    { id: 'orders',   label: 'My Orders',        icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist',          icon: Heart },
    { id: 'profile',  label: 'Profile Settings', icon: Settings },
  ]

  const safeOrders = Array.isArray(orders) ? orders : []

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.05]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]" style={{ background: 'hsl(327 80% 62%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden sticky top-20"
              style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>

              {/* Profile header */}
              <div className="relative p-6 pb-8 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, hsl(258 90% 8%), hsl(270 60% 12%))' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ background: 'radial-gradient(circle, hsl(258 90% 66% / 0.15), transparent 70%)' }} />
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
                    {userId ? userId.toString()[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Account</h3>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{userId}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color: 'hsl(258 90% 75%)', background: 'hsl(258 90% 66% / 0.15)', border: '1px solid hsl(258 90% 66% / 0.25)' }}>
                    <Star className="w-2.5 h-2.5 fill-current" /> Premium Member
                  </span>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2 space-y-0.5">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id as DashboardTab)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200"
                    style={{
                      background: activeTab === item.id ? 'hsl(258 90% 66% / 0.12)' : 'transparent',
                      color: activeTab === item.id ? 'hsl(258 90% 75%)' : 'rgba(255,255,255,0.45)',
                      border: activeTab === item.id ? '1px solid hsl(258 90% 66% / 0.2)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (activeTab !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (activeTab !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                    {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(258 90% 72%)' }} />}
                  </button>
                ))}
              </nav>

              <div className="p-2 border-t mt-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <button onClick={() => { logout(); router.push("/login") }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ color: 'rgba(239,68,68,0.7)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(239,68,68,0.08)'; el.style.color = 'rgb(239,68,68)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(239,68,68,0.7)' }}>
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5 opacity-0" style={{ animation: 'slideUp 0.4s ease forwards' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'hsl(258 90% 72%)' }}>Dashboard</p>
                  <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Overview</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Total Orders"  value={String(safeOrders.length)} sub="Lifetime purchases"    accent="hsl(258 90% 72%)" />
                  <StatCard label="Total Spent"   value={`$${totalSpent.toFixed(2)}`} sub="Across all orders"  accent="hsl(327 80% 68%)" />
                  <StatCard label="Reward Points" value={String(Math.floor(totalSpent))} sub="Redeem for discounts" accent="rgb(251,191,36)" />
                </div>

                {/* Recent orders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{ color: 'hsl(258 90% 72%)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '8px' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '6px' }}>
                      View all <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isLoading ? <OrderSkeleton /> : safeOrders.length === 0 ? (
                    <div className="rounded-2xl p-10 text-center space-y-4" style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Package className="w-10 h-10 mx-auto" style={{ color: 'rgba(255,255,255,0.15)' }} />
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No orders yet.</p>
                      <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
                        Browse Products
                      </Link>
                    </div>
                  ) : safeOrders.slice(0, 3).map((order, i) => (
                    <div key={order._id}
                      className="rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-200"
                      style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)', animationDelay: `${i * 80}ms` }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.transform = 'translateX(4px)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.05)'; el.style.transform = 'translateX(0)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: 'linear-gradient(135deg, hsl(258 90% 8%), hsl(270 60% 12%))', border: '1px solid hsl(258 90% 66% / 0.15)' }}>
                          📦
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                          <p className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            <Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1.5">
                        <p className="font-bold text-white">${order.totalPrice.toFixed(2)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4 opacity-0" style={{ animation: 'slideUp 0.4s ease forwards' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'hsl(258 90% 72%)' }}>History</p>
                    <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Order History</h2>
                  </div>
                  <Link href="/orders"
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.8)'; el.style.background = 'rgba(255,255,255,0.07)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.5)'; el.style.background = 'rgba(255,255,255,0.04)' }}>
                    Detailed view <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                {isLoading ? <OrderSkeleton /> : safeOrders.length === 0 ? (
                  <div className="rounded-2xl p-16 text-center space-y-5" style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <ShoppingBag className="w-12 h-12 mx-auto" style={{ color: 'rgba(255,255,255,0.1)' }} />
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No orders yet</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Start shopping to see your orders here.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : safeOrders.map((order, i) => (
                  <div key={order._id}
                    className="rounded-2xl p-6 transition-all duration-200"
                    style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)', animationDelay: `${i * 60}ms` }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="font-bold text-sm text-white">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold" style={{
                          fontFamily: "'Syne', sans-serif",
                          background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>${order.totalPrice.toFixed(2)}</p>
                        <Link href="/orders" className="flex items-center gap-1 text-xs font-semibold transition-colors"
                          style={{ color: 'hsl(258 90% 72%)' }}>
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4 opacity-0" style={{ animation: 'slideUp 0.4s ease forwards' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'hsl(258 90% 72%)' }}>Saved</p>
                  <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Wishlist</h2>
                </div>
                <div className="rounded-2xl p-16 text-center space-y-5" style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(327 80% 10%), hsl(340 60% 14%))', border: '1px solid hsl(327 80% 62% / 0.2)' }}>
                    <Heart className="w-8 h-8" style={{ color: 'hsl(327 80% 68%)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No saved items</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Browse products and tap the heart icon to save items you love.</p>
                  <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
                    Browse Products
                  </Link>
                </div>
              </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5 max-w-2xl opacity-0" style={{ animation: 'slideUp 0.4s ease forwards' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'hsl(258 90% 72%)' }}>Settings</p>
                  <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Profile</h2>
                </div>

                <div className="rounded-2xl p-6 space-y-6" style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>User ID</label>
                    <input type="text" disabled value={userId || ""}
                      className="w-full px-4 py-3.5 rounded-xl text-sm cursor-not-allowed outline-none"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }} />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Your unique identifier — this cannot be changed.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Account Status</label>
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                      style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-semibold" style={{ color: 'rgb(110,231,183)' }}>Active & Verified</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Membership</label>
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                      style={{ background: 'hsl(258 90% 66% / 0.06)', border: '1px solid hsl(258 90% 66% / 0.15)' }}>
                      <Star className="w-4 h-4" style={{ color: 'hsl(258 90% 72%)' }} />
                      <span className="text-sm font-semibold text-white">Premium Member</span>
                      <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ color: 'hsl(258 90% 75%)', background: 'hsl(258 90% 66% / 0.15)', border: '1px solid hsl(258 90% 66% / 0.25)' }}>
                        Active
                      </span>
                    </div>
                  </div>

                  <button onClick={() => toast.info("Profile updates are handled via account registration.")}
                    className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.25)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.4)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.25)' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        input[disabled]::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  )
}
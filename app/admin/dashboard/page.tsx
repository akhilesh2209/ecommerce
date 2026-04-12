'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  BarChart3, Users, ShoppingCart, DollarSign, TrendingUp,
  Settings, Plus, Edit2, Trash2, Eye, ArrowUpRight, Package, Activity
} from 'lucide-react'
import { useState } from 'react'

type AdminTab = 'overview' | 'products' | 'orders' | 'customers'

const ADMIN_STATS = [
  { label: 'Total Revenue',    value: '$48,520', change: '+12.5%', icon: DollarSign,  color: 'text-green-500',  bg: 'bg-green-500/10'  },
  { label: 'Total Orders',     value: '1,284',   change: '+8.2%',  icon: ShoppingCart, color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
  { label: 'Total Customers',  value: '2,847',   change: '+15.3%', icon: Users,        color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'Conversion Rate',  value: '3.24%',   change: '+2.1%',  icon: TrendingUp,   color: 'text-amber-500',  bg: 'bg-amber-500/10'  },
]

const PRODUCTS = [
  { id: 1, name: 'Premium Wireless Headphones', price: 299.99, stock: 145, sales: 324, status: 'Active' },
  { id: 2, name: 'Smart Home Hub',              price: 149.99, stock: 82,  sales: 203, status: 'Active' },
  { id: 3, name: 'LED Desk Lamp',               price: 49.99,  stock: 0,   sales: 156, status: 'Out of Stock' },
  { id: 4, name: 'Gaming Mouse',                price: 69.99,  stock: 234, sales: 412, status: 'Active' },
  { id: 5, name: 'Portable Speaker',            price: 129.99, stock: 98,  sales: 267, status: 'Active' },
]

const RECENT_ORDERS = [
  { id: 'PS-001234', customer: 'Sarah Anderson', total: 809.96, status: 'Delivered', date: '2024-03-20' },
  { id: 'PS-001233', customer: 'John Smith',     total: 299.99, status: 'Processing', date: '2024-03-20' },
  { id: 'PS-001232', customer: 'Emma Johnson',   total: 549.97, status: 'Shipped',    date: '2024-03-19' },
  { id: 'PS-001231', customer: 'Michael Chen',   total: 149.99, status: 'Delivered',  date: '2024-03-19' },
]

const statusClass: Record<string, string> = {
  Delivered:  'status-delivered',
  Shipped:    'status-shipped',
  Processing: 'status-processing',
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: BarChart3 },
    { id: 'products',   label: 'Products',   icon: Package },
    { id: 'orders',     label: 'Orders',     icon: ShoppingCart },
    { id: 'customers',  label: 'Customers',  icon: Users },
  ]

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between opacity-0 animate-fade-in-up">
          <div className="space-y-1">
            <p className="section-label">Management</p>
            <h1 className="font-display text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor your store performance and manage products</p>
          </div>
          <button className="btn-outline hidden sm:flex items-center gap-2 px-5 py-2.5">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-border opacity-0 animate-fade-in-up delay-100">
          <div className="flex gap-1 -mb-px overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 opacity-0 animate-fade-in-up">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ADMIN_STATS.map((stat, i) => (
                <div key={stat.label} className="card-luxury p-6 space-y-4" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="font-display text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {stat.change} from last month
                  </div>
                </div>
              ))}
            </div>

            {/* Charts area */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card-luxury p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Sales Overview</h3>
                  <div className="flex gap-2">
                    {['7D', '1M', '3M', '1Y'].map(p => (
                      <button key={p} className="text-xs px-2.5 py-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Chart placeholder with nicer visual */}
                <div className="h-56 bg-warm-gradient rounded-xl relative overflow-hidden flex items-end px-4 pb-4 gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-accent to-accent/40 transition-all"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                  <div className="absolute top-4 left-4 text-xs text-muted-foreground font-medium">Revenue trend</div>
                </div>
              </div>

              <div className="card-luxury p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Top Products</h3>
                <div className="space-y-3">
                  {PRODUCTS.slice(0, 4).map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm">📦</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="w-24">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(product.sales / 412) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card-luxury p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recent Orders</h3>
                <button className="text-sm text-accent flex items-center gap-1 hover:gap-2 transition-all" onClick={() => setActiveTab('orders')}>
                  View all <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Order ID', 'Customer', 'Date', 'Status', 'Total'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider last:text-right">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {RECENT_ORDERS.map(order => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono-custom text-xs text-foreground">{order.id}</td>
                        <td className="py-3.5 px-4 text-foreground font-medium">{order.customer}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{order.date}</td>
                        <td className="py-3.5 px-4">
                          <span className={`badge ${statusClass[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">${order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
              <button className="btn-accent px-4 py-2.5 text-sm">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="card-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      {['Product', 'Price', 'Stock', 'Sales', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider last:text-right">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {PRODUCTS.map(product => (
                      <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-warm-gradient flex items-center justify-center text-lg">📦</div>
                            <span className="font-medium text-foreground">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono-custom text-sm text-foreground">${product.price}</td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${product.stock > 100 ? 'text-green-500' : product.stock > 0 ? 'text-amber-500' : 'text-destructive'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-foreground font-medium">{product.sales}</td>
                        <td className="py-4 px-6">
                          <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder tabs */}
        {(activeTab === 'orders' || activeTab === 'customers') && (
          <div className="card-luxury p-16 text-center space-y-4 opacity-0 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              {activeTab === 'orders' ? 'Orders Management' : 'Customer Management'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Full management interface coming soon. We're building something incredible.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-accent font-medium">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              In development
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
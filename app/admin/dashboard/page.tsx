'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react'
import { useState } from 'react'

type AdminTab = 'overview' | 'products' | 'orders' | 'customers'

const ADMIN_STATS = [
  {
    label: 'Total Revenue',
    value: '$48,520',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-500',
  },
  {
    label: 'Total Orders',
    value: '1,284',
    change: '+8.2%',
    icon: ShoppingCart,
    color: 'text-blue-500',
  },
  {
    label: 'Total Customers',
    value: '2,847',
    change: '+15.3%',
    icon: Users,
    color: 'text-purple-500',
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: '+2.1%',
    icon: TrendingUp,
    color: 'text-orange-500',
  },
]

const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    stock: 145,
    sales: 324,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Smart Home Hub',
    price: 149.99,
    stock: 82,
    sales: 203,
    status: 'Active',
  },
  {
    id: 3,
    name: 'LED Desk Lamp',
    price: 49.99,
    stock: 0,
    sales: 156,
    status: 'Out of Stock',
  },
  {
    id: 4,
    name: 'Gaming Mouse',
    price: 69.99,
    stock: 234,
    sales: 412,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Portable Speaker',
    price: 129.99,
    stock: 98,
    sales: 267,
    status: 'Active',
  },
]

const RECENT_ORDERS = [
  {
    id: 'PrimeStore-2024-001234',
    customer: 'Sarah Anderson',
    total: 809.96,
    status: 'Delivered',
    date: '2024-03-20',
  },
  {
    id: 'PrimeStore-2024-001233',
    customer: 'John Smith',
    total: 299.99,
    status: 'Processing',
    date: '2024-03-20',
  },
  {
    id: 'PrimeStore-2024-001232',
    customer: 'Emma Johnson',
    total: 549.97,
    status: 'Shipped',
    date: '2024-03-19',
  },
  {
    id: 'PrimeStore-2024-001231',
    customer: 'Michael Chen',
    total: 149.99,
    status: 'Delivered',
    date: '2024-03-19',
  },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your store and track performance</p>
          </div>
          <button className="hidden sm:flex items-center space-x-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-border/50">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: ShoppingCart },
              { id: 'orders', label: 'Orders', icon: TrendingUp },
              { id: 'customers', label: 'Customers', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ADMIN_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-500">
                    {stat.change} from last month
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sales Chart */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Sales Overview</h3>
                <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart placeholder</p>
                </div>
              </div>

              {/* Top Products */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Top Products</h3>
                <div className="space-y-3">
                  {PRODUCTS.slice(0, 4).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales
                        </p>
                      </div>
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${(product.sales / 412) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-foreground">{order.customer}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-foreground">
                          ${order.total}
                        </td>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Products</h2>
              <button className="flex items-center space-x-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition-colors">
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/50 bg-muted/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                        Product Name
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                        Sales
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-4 px-6 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {PRODUCTS.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-foreground">
                          {product.name}
                        </td>
                        <td className="py-4 px-6 text-foreground">${product.price}</td>
                        <td className="py-4 px-6 text-foreground">
                          <span
                            className={`font-medium ${
                              product.stock > 100
                                ? 'text-green-500'
                                : product.stock > 0
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-foreground">{product.sales}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              product.status === 'Active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex justify-end space-x-2">
                          <button
                            title="View"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            title="Delete"
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders & Customers Tabs - Placeholder */}
        {(activeTab === 'orders' || activeTab === 'customers') && (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-2xl font-bold text-foreground mb-2">
              {activeTab === 'orders' ? 'Orders Management' : 'Customers Management'}
            </p>
            <p className="text-muted-foreground">
              Detailed management interface coming soon
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

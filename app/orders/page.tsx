'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import API from "@/lib/api"
import { toast } from "sonner"
import {
  CheckCircle2, ShoppingCart, Package, Clock, ChevronDown, ChevronUp,
  ArrowRight, Truck, MapPin, Star, RotateCcw, Search, Filter,
  TrendingUp, Calendar, DollarSign, ShoppingBag, X, ExternalLink,
  Zap, AlertCircle
} from 'lucide-react'
import { useAppState } from "@/components/app-state-provider"

// ─── Types ────────────────────────────────────────────────────────

type OrderItem = { name: string; price: number; quantity: number }

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

type FilterStatus = 'all' | 'processing' | 'shipped' | 'delivered'

// ─── Constants ────────────────────────────────────────────────────

const STATUS_CONFIG = {
  delivered: {
    label: 'Delivered',
    dot: 'bg-emerald-400',
    badge: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
    icon: CheckCircle2,
    progress: 100,
    step: 3,
    glow: 'rgba(52,211,153,0.15)',
  },
  shipped: {
    label: 'Shipped',
    dot: 'bg-violet-400',
    badge: 'text-violet-300 border-violet-400/25 bg-violet-400/10',
    icon: Truck,
    progress: 66,
    step: 2,
    glow: 'rgba(167,139,250,0.15)',
  },
  processing: {
    label: 'Processing',
    dot: 'bg-amber-400',
    badge: 'text-amber-300 border-amber-400/25 bg-amber-400/10',
    icon: Clock,
    progress: 33,
    step: 1,
    glow: 'rgba(251,191,36,0.15)',
  },
} as const

const DELIVERY_STAGES = ['Order Placed', 'Processing', 'Shipped', 'Delivered'] as const

const FILTER_TABS: { id: FilterStatus; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

// ─── Utility ──────────────────────────────────────────────────────

function getStatusConfig(status: string) {
  const key = status?.toLowerCase() as keyof typeof STATUS_CONFIG
  return STATUS_CONFIG[key] ?? STATUS_CONFIG.processing
}

function formatOrderId(id: string) {
  return `#${id.toString().slice(-8).toUpperCase()}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Sub-components ───────────────────────────────────────────────

function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Primary orb */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.07]"
        style={{ background: 'hsl(258 90% 66%)' }}
      />
      {/* Secondary orb */}
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
        style={{ background: 'hsl(327 80% 62%)' }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2.5">
            <div className="h-4 w-40 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-28 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
          <div className="h-6 w-24 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="flex gap-2 pt-1">
          {[80, 60, 72].map((w, i) => (
            <div
              key={i}
              className="h-7 rounded-xl animate-pulse"
              style={{ width: `${w}px`, background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-8 w-28 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map(i => (
        <div key={i} style={{ animationDelay: `${i * 80}ms`, opacity: 1 - i * 0.2 }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

// ─── Delivery Timeline ────────────────────────────────────────────

function DeliveryTimeline({ status }: { status: string }) {
  const cfg = getStatusConfig(status)
  const activeStep = cfg.step

  return (
    <div className="relative">
      {/* Track line */}
      <div
        className="absolute top-3.5 left-3.5 right-3.5 h-px"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      {/* Progress fill */}
      <div
        className="absolute top-3.5 left-3.5 h-px transition-all duration-1000 ease-out"
        style={{
          width: `calc(${cfg.progress}% - 28px)`,
          background: 'linear-gradient(90deg, hsl(258 90% 66%), hsl(327 80% 62%))',
          boxShadow: '0 0 8px hsl(258 90% 66% / 0.5)',
        }}
      />

      <div className="relative flex justify-between">
        {DELIVERY_STAGES.map((stage, i) => {
          const isDone = i < activeStep
          const isCurrent = i === activeStep
          return (
            <div key={stage} className="flex flex-col items-center gap-2" style={{ minWidth: 0 }}>
              {/* Node */}
              <div
                className="relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 z-10"
                style={{
                  background: isDone
                    ? 'linear-gradient(135deg, hsl(258 90% 66%), hsl(327 80% 62%))'
                    : isCurrent
                    ? 'hsl(224 18% 12%)'
                    : 'hsl(224 18% 10%)',
                  border: isDone
                    ? 'none'
                    : isCurrent
                    ? '1.5px solid hsl(258 90% 66% / 0.7)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  boxShadow: isDone ? '0 0 12px hsl(258 90% 66% / 0.4)' : isCurrent ? '0 0 0 4px hsl(258 90% 66% / 0.12)' : 'none',
                }}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${isCurrent ? 'animate-pulse' : ''}`}
                    style={{
                      background: isCurrent ? 'hsl(258 90% 66%)' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <p
                className="text-[9px] font-semibold text-center leading-tight tracking-wide uppercase"
                style={{
                  color: isDone
                    ? 'rgba(255,255,255,0.6)'
                    : isCurrent
                    ? 'hsl(258 90% 75%)'
                    : 'rgba(255,255,255,0.2)',
                  maxWidth: '52px',
                }}
              >
                {stage}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = getStatusConfig(order.status)
  const StatusIcon = cfg.icon

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500 opacity-0"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: `slideUp 0.5s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms forwards`,
        boxShadow: expanded ? `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)` : 'none',
      }}
    >
      {/* ── Card Top ── */}
      <div className="p-6">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="space-y-1.5">
            {/* Order ID */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${cfg.glow.replace('0.15', '0.25')}, transparent)`,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Package className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <span
                className="text-sm font-bold tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', 'DM Mono', monospace", color: 'rgba(255,255,255,0.85)' }}
              >
                {formatOrderId(order._id)}
              </span>
            </div>
            {/* Date */}
            <p className="text-xs pl-[38px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Right side: status + price */}
          <div className="flex flex-col items-end gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: cfg.badge.split(' ')[0].replace('text-', ''), borderColor: '', background: '' }}
            >
              {/* Inline status badge with precise styling */}
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  background: cfg.glow,
                  border: `1px solid ${cfg.glow.replace('0.15', '0.35')}`,
                  color: cfg.dot === 'bg-emerald-400'
                    ? 'rgb(110,231,183)'
                    : cfg.dot === 'bg-violet-400'
                    ? 'rgb(196,181,253)'
                    : 'rgb(252,211,77)',
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                {cfg.label}
              </span>
            </span>
            <p
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              ${order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="mb-5 px-1">
          <DeliveryTimeline status={order.status} />
        </div>

        {/* Item chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {order.items.slice(0, 3).map((it, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <Package className="w-3 h-3 opacity-60" />
              {it.name}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              >
                ×{it.quantity}
              </span>
            </span>
          ))}
          {order.items.length > 3 && (
            <span
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl"
              style={{
                background: 'hsl(258 90% 66% / 0.1)',
                border: '1px solid hsl(258 90% 66% / 0.2)',
                color: 'hsl(258 90% 72%)',
              }}
            >
              +{order.items.length - 3} more
            </span>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold transition-all duration-200 group"
          style={{ color: expanded ? 'hsl(258 90% 72%)' : 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
          onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Hide details</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> View full details</>
          )}
        </button>
      </div>

      {/* ── Expanded Panel ── */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            animation: 'expandDown 0.3s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {/* Order date full */}
          <div
            className="mx-6 mt-5 mb-4 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Placed on {formatDateLong(order.createdAt)}
            </p>
          </div>

          {/* Items list */}
          <div className="px-6 pb-2 space-y-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Items in this order
            </p>
            <div className="space-y-1">
              {order.items.map((it, idx) => (
                <div
                  key={`${it.name}-${idx}`}
                  className="flex items-center justify-between py-3 group"
                  style={{
                    borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      📦
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {it.name}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        ${it.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      ×{it.quantity}
                    </span>
                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)', minWidth: '60px', textAlign: 'right' }}>
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="px-6 py-5">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.05), hsl(327 80% 62% / 0.03))',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="p-4 space-y-2.5">
                {[
                  { label: 'Subtotal', value: `$${order.subtotal?.toFixed(2) ?? '—'}`, icon: DollarSign },
                  { label: 'Tax (8%)', value: `$${order.tax?.toFixed(2) ?? '—'}`, icon: TrendingUp },
                  { label: 'Shipping', value: order.shipping === 0 ? 'Free 🎉' : `$${order.shipping?.toFixed(2)}`, icon: Truck, green: order.shipping === 0 },
                ].map(({ label, value, icon: Icon, green }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: green ? 'rgb(110,231,183)' : 'rgba(255,255,255,0.55)' }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Total row */}
              <div
                className="px-4 py-3 flex justify-between items-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Paid</span>
                <span
                  className="text-base font-bold"
                  style={{
                    background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="px-6 pb-6 flex flex-wrap gap-3"
          >
            <button
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: 'hsl(258 90% 66% / 0.1)',
                border: '1px solid hsl(258 90% 66% / 0.2)',
                color: 'hsl(258 90% 72%)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'hsl(258 90% 66% / 0.18)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'hsl(258 90% 66% / 0.1)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <MapPin className="w-3.5 h-3.5" /> Track Order
            </button>
            <button
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.07)'
                el.style.color = 'rgba(255,255,255,0.7)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Request Return
            </button>
            <button
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.07)'
                el.style.color = 'rgba(255,255,255,0.7)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              <Star className="w-3.5 h-3.5" /> Write Review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────

function StatsBar({ orders }: { orders: Order[] }) {
  const totalSpent = orders.reduce((s, o) => s + o.totalPrice, 0)
  const delivered = orders.filter(o => o.status?.toLowerCase() === 'delivered').length
  const totalItems = orders.reduce((s, o) => s + o.items.reduce((si, it) => si + it.quantity, 0), 0)

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'hsl(258 90% 72%)' },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: 'hsl(327 80% 68%)' },
    { label: 'Delivered', value: delivered.toString(), icon: CheckCircle2, color: 'rgb(110,231,183)' },
    { label: 'Items Ordered', value: totalItems.toString(), icon: Package, color: 'rgb(251,191,36)' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {stats.map(({ label, value, icon: Icon, color }, i) => (
        <div
          key={label}
          className="rounded-2xl p-4 transition-all duration-300 opacity-0"
          style={{
            background: 'hsl(224 18% 7%)',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: `slideUp 0.5s cubic-bezier(0.23,1,0.32,1) ${200 + i * 60}ms forwards`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {label}
            </p>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: `${color}15` }}
            >
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color, fontFamily: "'Syne', sans-serif" }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Search & Filter Bar ──────────────────────────────────────────

function SearchFilterBar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  orders,
}: {
  query: string
  onQueryChange: (v: string) => void
  activeFilter: FilterStatus
  onFilterChange: (f: FilterStatus) => void
  orders: Order[]
}) {
  const counts: Record<FilterStatus, number> = {
    all: orders.length,
    processing: orders.filter(o => o.status?.toLowerCase() === 'processing').length,
    shipped: orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        />
        <input
          type="text"
          placeholder="Search by order ID or product name…"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 text-sm outline-none transition-all duration-200"
          style={{
            background: 'hsl(224 18% 7%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'inherit',
          }}
          onFocus={e => { (e.target as HTMLElement).style.borderColor = 'hsl(258 90% 66% / 0.5)'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px hsl(258 90% 66% / 0.1)' }}
          onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.boxShadow = 'none' }}
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 p-1 rounded-2xl overflow-x-auto"
        style={{ background: 'hsl(224 18% 6%)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {FILTER_TABS.map(({ id, label }) => {
          const active = activeFilter === id
          return (
            <button
              key={id}
              onClick={() => onFilterChange(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={{
                background: active ? 'linear-gradient(135deg, hsl(258 90% 66% / 0.2), hsl(327 80% 62% / 0.1))' : 'transparent',
                border: active ? '1px solid hsl(258 90% 66% / 0.3)' : '1px solid transparent',
                color: active ? 'hsl(258 90% 75%)' : 'rgba(255,255,255,0.35)',
              }}
            >
              {label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  background: active ? 'hsl(258 90% 66% / 0.2)' : 'rgba(255,255,255,0.06)',
                  color: active ? 'hsl(258 90% 75%)' : 'rgba(255,255,255,0.25)',
                }}
              >
                {counts[id]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-16 text-center space-y-8"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'scaleIn 0.5s cubic-bezier(0.23,1,0.32,1) forwards',
      }}
    >
      {/* Animated bag */}
      <div className="relative inline-block">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: 'hsl(258 90% 66%)', transform: 'scale(1.5)' }}
        />
        <div
          className="relative w-24 h-24 rounded-2xl mx-auto flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.12), hsl(327 80% 62% / 0.06))',
            border: '1px solid hsl(258 90% 66% / 0.2)',
            animation: 'float 5s ease-in-out infinite',
          }}
        >
          <ShoppingCart className="w-10 h-10" style={{ color: 'hsl(258 90% 72%)' }} />
        </div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <h2
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          No orders yet
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          When you place your first order, it'll appear right here with full tracking and details.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { icon: Truck, label: 'Live tracking' },
          { icon: Package, label: 'Order history' },
          { icon: Star, label: 'Write reviews' },
          { icon: RotateCcw, label: 'Easy returns' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
        ))}
      </div>

      <Link
        href="/products"
        className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-sm font-bold text-white transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))',
          boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.45)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)'
        }}
      >
        <Zap className="w-4 h-4" />
        Start Shopping
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

// ─── No Results State ─────────────────────────────────────────────

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div
      className="rounded-2xl p-12 text-center space-y-5"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'scaleIn 0.3s ease forwards',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <AlertCircle className="w-7 h-7" style={{ color: 'rgba(255,255,255,0.25)' }} />
      </div>
      <div className="space-y-2">
        <p className="text-base font-bold text-white">No results found</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          No orders match <span className="font-mono text-violet-400">"{query}"</span>
        </p>
      </div>
      <button
        onClick={onClear}
        className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        Clear search
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { userId } = useAppState()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')

  // ── Data fetch (original connection untouched) ──
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) {
          toast.error("Please login to view your orders")
          setOrders([])
          return
        }
        const res = await API.get(`/orders/${userId}`)
        setOrders(res.data.orders || [])
      } catch {
        toast.error("Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [userId])

  // ── Filtered + searched orders ──
  const displayedOrders = useMemo(() => {
    let result = orders

    if (activeFilter !== 'all') {
      result = result.filter(o => o.status?.toLowerCase() === activeFilter)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(o =>
        o._id.toLowerCase().includes(q) ||
        o.items.some(it => it.name.toLowerCase().includes(q))
      )
    }

    return result
  }, [orders, activeFilter, query])

  const hasOrders = orders.length > 0
  const hasResults = displayedOrders.length > 0
  const isFiltering = query.trim() || activeFilter !== 'all'

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>
      <PageBackground />
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div
          className="mb-8 flex items-end justify-between opacity-0"
          style={{ animation: 'slideUp 0.5s cubic-bezier(0.23,1,0.32,1) 50ms forwards' }}
        >
          <div className="space-y-2">
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'hsl(258 90% 72%)' }}
            >
              Order Management
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your Orders
            </h1>
            {!isLoading && hasOrders && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {orders.length} order{orders.length !== 1 ? 's' : ''} · All time
              </p>
            )}
          </div>

          {/* Header badge */}
          {!isLoading && hasOrders && (
            <div
              className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold"
              style={{
                background: 'hsl(224 18% 7%)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live tracking enabled
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {isLoading && <OrderSkeleton />}

        {/* ── Empty state ── */}
        {!isLoading && !hasOrders && <EmptyState />}

        {/* ── Orders view ── */}
        {!isLoading && hasOrders && (
          <>
            <StatsBar orders={orders} />

            <SearchFilterBar
              query={query}
              onQueryChange={setQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              orders={orders}
            />

            {/* Results count indicator */}
            {isFiltering && hasResults && (
              <p
                className="text-xs mb-4"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Showing {displayedOrders.length} of {orders.length} orders
              </p>
            )}

            {/* Order cards */}
            {hasResults ? (
              <div className="space-y-4">
                {displayedOrders.map((order, i) => (
                  <OrderCard key={order._id} order={order} index={i} />
                ))}
              </div>
            ) : (
              <NoResults query={query} onClear={() => { setQuery(''); setActiveFilter('all') }} />
            )}
          </>
        )}
      </main>

      <Footer />

      {/* ── Global keyframes ── */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-10px); }
        }

        input::placeholder { color: rgba(255,255,255,0.2) !important; }

        /* Scrollbar for filter tabs */
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
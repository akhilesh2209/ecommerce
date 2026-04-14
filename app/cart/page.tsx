'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useEffect, useState } from "react";
import API from "@/lib/api";
import {
  Trash2, Plus, Minus, ArrowRight, Gift, ShoppingBag, Tag,
  Truck, Shield, ShoppingCart, Zap, Package, DollarSign,
  TrendingUp, Sparkles, Lock, CheckCircle2, X
} from 'lucide-react'
import Link from 'next/link'
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";

// ─── Page Background (matches Orders page) ────────────────────────

function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.07]"
        style={{ background: 'hsl(258 90% 66%)' }}
      />
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
        style={{ background: 'hsl(327 80% 62%)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04]"
        style={{ background: 'hsl(200 90% 60%)' }}
      />
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

// ─── Skeleton ─────────────────────────────────────────────────────

function SkeletonCartItem() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-5 flex gap-5">
        <div className="h-28 w-28 rounded-2xl flex-shrink-0 animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-3/4 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-3 w-1/3 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="flex justify-between items-center pt-4">
            <div className="h-9 w-28 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="h-4 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonSummary() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="p-6 space-y-5">
        <div className="h-5 w-40 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        {[100, 80, 70, 90].map((w, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 rounded-lg animate-pulse" style={{ width: `${w}px`, background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 100}ms` }} />
            <div className="h-3 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 100}ms` }} />
          </div>
        ))}
        <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-12 w-full rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-10 w-full rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {[0, 1, 2].map(i => (
          <div key={i} style={{ opacity: 1 - i * 0.2 }}>
            <SkeletonCartItem />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <SkeletonSummary />
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────

function CartStatsBar({ items }: { items: any[] }) {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)
  const savings = subtotal > 100 ? 15 : 0
  const uniqueCategories = new Set(items.map(i => i.product?.category).filter(Boolean)).size

  const stats = [
    { label: 'Items', value: totalItems.toString(), icon: ShoppingCart, color: 'hsl(258 90% 72%)' },
    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}`, icon: DollarSign, color: 'hsl(327 80% 68%)' },
    { label: 'You Save', value: savings > 0 ? `$${savings.toFixed(2)}` : 'Add more', icon: TrendingUp, color: 'rgb(110,231,183)' },
    { label: 'Categories', value: uniqueCategories.toString() || '—', icon: Package, color: 'rgb(251,191,36)' },
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
              style={{ background: `${color}18` }}
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

// ─── Cart Item Card ───────────────────────────────────────────────

function CartItemCard({
  item,
  index,
  isUpdating,
  onUpdateQuantity,
}: {
  item: any
  index: number
  isUpdating: boolean
  onUpdateQuantity: (id: string, qty: number) => void
}) {
  const lineTotal = ((item.product?.price || 0) * item.quantity).toFixed(2)

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500 opacity-0"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: `slideUp 0.5s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms forwards`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <div className="p-5 flex gap-5">
        {/* Product Image */}
        <div
          className="h-28 w-28 flex-shrink-0 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {item.product?.image && item.product.image.startsWith('http') ? (
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.1), hsl(327 80% 62% / 0.06))' }}
            >
              🛍️
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              {/* Category chip */}
              {item.product?.category && (
                <span
                  className="inline-flex items-center text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-2"
                  style={{
                    background: 'hsl(258 90% 66% / 0.1)',
                    border: '1px solid hsl(258 90% 66% / 0.2)',
                    color: 'hsl(258 90% 72%)',
                  }}
                >
                  {item.product.category}
                </span>
              )}
              <h3
                className="font-bold text-base line-clamp-2 leading-snug"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Syne', sans-serif" }}
              >
                {item.product?.name || "Product"}
              </h3>
            </div>

            {/* Price (right) */}
            <div className="text-right flex-shrink-0">
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
                ${lineTotal}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                ${item.product?.price?.toFixed(2)} each
              </p>
            </div>
          </div>

          {/* Bottom row: quantity + remove */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity stepper */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => {
                  if (!isUpdating && item.quantity > 1) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span
                className="w-9 text-center text-sm font-bold"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', 'DM Mono', monospace" }}
              >
                {item.quantity}
              </span>

              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => {
                  if (!isUpdating) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onUpdateQuantity(item._id, 0)}
              disabled={isUpdating}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-30"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.12)',
                color: 'rgba(239,68,68,0.5)',
              }}
              onMouseEnter={e => {
                if (!isUpdating) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgb(239,68,68)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.12)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Promo Input ──────────────────────────────────────────────────

function PromoSection({
  promoCode,
  setPromoCode,
  promoApplied,
  promoDiscount,
  onApply,
}: {
  promoCode: string
  setPromoCode: (v: string) => void
  promoApplied: boolean
  promoDiscount: number
  onApply: () => void
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'hsl(224 18% 7%)',
        border: promoApplied ? '1px solid rgba(110,231,183,0.25)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'border 0.3s ease',
      }}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: promoApplied ? 'rgba(110,231,183,0.12)' : 'rgba(255,255,255,0.05)',
              border: promoApplied ? '1px solid rgba(110,231,183,0.2)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {promoApplied ? (
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'rgb(110,231,183)' }} />
            ) : (
              <Tag className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {promoApplied ? 'Promo Applied!' : 'Promo Code'}
            </p>
            {promoApplied && (
              <p className="text-[11px]" style={{ color: 'rgb(110,231,183)' }}>
                Saving ${promoDiscount.toFixed(2)} on this order
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code…"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
            disabled={promoApplied}
            className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onFocus={e => {
              (e.target as HTMLElement).style.borderColor = 'hsl(258 90% 66% / 0.5)'
              ;(e.target as HTMLElement).style.boxShadow = '0 0 0 3px hsl(258 90% 66% / 0.1)'
            }}
            onBlur={e => {
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
              ;(e.target as HTMLElement).style.boxShadow = 'none'
            }}
          />
          <button
            onClick={onApply}
            disabled={promoApplied}
            className="px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: promoApplied
                ? 'rgba(110,231,183,0.12)'
                : 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))',
              color: promoApplied ? 'rgb(110,231,183)' : 'white',
              boxShadow: promoApplied ? 'none' : '0 4px 16px hsl(258 90% 66% / 0.25)',
            }}
            onMouseEnter={e => {
              if (!promoApplied) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px hsl(258 90% 66% / 0.4)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = promoApplied ? 'none' : '0 4px 16px hsl(258 90% 66% / 0.25)'
            }}
          >
            {promoApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>

        <p className="text-[11px] flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Sparkles className="w-3 h-3" style={{ color: 'hsl(258 90% 66%)' }} />
          Try{' '}
          <span
            className="font-bold"
            style={{ color: 'hsl(258 90% 72%)', fontFamily: "'JetBrains Mono', monospace" }}
          >
            SAVE10
          </span>{' '}
          — get 10% off your order
        </p>
      </div>
    </div>
  )
}

// ─── Order Summary Panel ──────────────────────────────────────────

function OrderSummaryPanel({
  items,
  subtotal,
  tax,
  shipping,
  promoDiscount,
  total,
}: {
  items: any[]
  subtotal: number
  tax: number
  shipping: number
  promoDiscount: number
  total: number
}) {
  const rows = [
    { label: `Subtotal (${items.length} item${items.length !== 1 ? 's' : ''})`, value: `$${subtotal.toFixed(2)}`, icon: DollarSign, green: false },
    { label: 'Shipping', value: shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`, icon: Truck, green: shipping === 0 },
    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}`, icon: TrendingUp, green: false },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Checkout
        </p>
        <h3
          className="text-lg font-bold"
          style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Syne', sans-serif" }}
        >
          Order Summary
        </h3>
      </div>

      {/* Price rows */}
      <div className="px-6 py-5">
        <div
          className="rounded-xl overflow-hidden mb-5"
          style={{
            background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.04), hsl(327 80% 62% / 0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="p-4 space-y-3">
            {rows.map(({ label, value, icon: Icon, green }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: green ? 'rgb(110,231,183)' : 'rgba(255,255,255,0.6)' }}
                >
                  {value}
                </span>
              </div>
            ))}
            {promoDiscount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <span className="text-xs" style={{ color: 'rgb(110,231,183)' }}>Discount (10%)</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'rgb(110,231,183)' }}>
                  −${promoDiscount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Total */}
          <div
            className="px-4 py-3.5 flex justify-between items-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Total</span>
            <div className="text-right">
              <p
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                ${total.toFixed(2)}
              </p>
              {promoDiscount > 0 && (
                <p className="text-[10px] mt-0.5" style={{ color: 'rgb(110,231,183)' }}>
                  You save ${promoDiscount.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Checkout CTA */}
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-sm font-bold text-white transition-all duration-300 mb-3"
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
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/products"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          Continue Shopping
        </Link>
      </div>

      {/* Trust badges */}
      <div
        className="px-6 pb-5 grid grid-cols-3 gap-2"
      >
        {[
          { icon: Truck, label: 'Free shipping', sub: 'over $100' },
          { icon: Shield, label: 'Secure', sub: 'checkout' },
          { icon: Gift, label: 'Gift wrap', sub: 'available' },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'hsl(258 90% 66% / 0.1)' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: 'hsl(258 90% 72%)' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security note */}
      <div
        className="mx-5 mb-5 px-4 py-3 rounded-xl flex items-center gap-2.5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          256-bit SSL encryption · Your data is protected
        </p>
      </div>
    </div>
  )
}

// ─── Empty Cart State ─────────────────────────────────────────────

function EmptyCartState() {
  return (
    <div
      className="rounded-2xl p-16 text-center space-y-8"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'scaleIn 0.5s cubic-bezier(0.23,1,0.32,1) forwards',
      }}
    >
      {/* Animated icon */}
      <div className="relative inline-block">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: 'hsl(258 90% 66%)', transform: 'scale(1.5)' }}
        />
        <div
          className="relative w-28 h-28 rounded-3xl mx-auto flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.12), hsl(327 80% 62% / 0.06))',
            border: '1px solid hsl(258 90% 66% / 0.2)',
            animation: 'float 5s ease-in-out infinite',
          }}
        >
          <ShoppingCart className="w-12 h-12" style={{ color: 'hsl(258 90% 72%)' }} />
        </div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <h2
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your cart is empty
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Looks like you haven't added anything yet. Discover our curated collection and find something you'll love.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { icon: Truck, label: 'Free shipping over $100' },
          { icon: Shield, label: 'Secure checkout' },
          { icon: Gift, label: 'Free gift wrapping' },
          { icon: RotateCcwIcon, label: 'Easy returns' },
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

// ─── Inline icon shim (RotateCcw not imported from lucide above) ──
const RotateCcwIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

// ─── Page ─────────────────────────────────────────────────────────

export default function CartPage() {
  const { userId, setCartCountFromItems } = useAppState();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          setItems([]);
          setCartCountFromItems([]);
          setIsLoadingCart(false);
          return;
        }
        const res = await API.get(`/cart/${userId}`);
        setItems(res.data);
        setCartCountFromItems(res.data || []);
      } catch (error) {
        toast.error("Failed to load cart");
      } finally {
        setIsLoadingCart(false);
      }
    };
    fetchCart();
  }, [userId, setCartCountFromItems]);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal + tax + shipping - promoDiscount;

  const applyPromo = () => {
    if (promoApplied) { toast.info("Promo already applied"); return; }
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoDiscount(subtotal * 0.1);
      setPromoApplied(true);
      toast.success("🎉 Promo code applied! 10% discount");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (isUpdating) return;
    const qty = Number(newQuantity);
    if (qty < 0) return;
    setIsUpdating(true);
    try {
      const res = await API.put("/cart", { cartId: id, quantity: qty });
      if (res.data?.message === "Item removed" || qty === 0) {
        const next = items.filter((item) => item._id !== id);
        setItems(next);
        setCartCountFromItems(next);
        toast.success("Item removed from cart");
      } else {
        const next = items.map((item) => item._id === id ? { ...item, quantity: res.data.quantity } : item);
        setItems(next);
        setCartCountFromItems(next);
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>
      <PageBackground />
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

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
              My Shopping
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your Cart
            </h1>
            {!isLoadingCart && items.length > 0 && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {items.length} item{items.length !== 1 ? 's' : ''} · Est. delivery in 3–5 days
              </p>
            )}
          </div>

          {/* Live badge */}
          {!isLoadingCart && items.length > 0 && (
            <div
              className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold"
              style={{
                background: 'hsl(224 18% 7%)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Prices updated live
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {isLoadingCart && <CartSkeleton />}

        {/* ── Empty ── */}
        {!isLoadingCart && items.length === 0 && <EmptyCartState />}

        {/* ── Cart View ── */}
        {!isLoadingCart && items.length > 0 && (
          <>
            {/* Stats */}
            <CartStatsBar items={items} />

            {/* Main grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Items header */}
                <div
                  className="flex items-center justify-between px-1 mb-2 opacity-0"
                  style={{ animation: 'slideUp 0.4s cubic-bezier(0.23,1,0.32,1) 300ms forwards' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {items.length} item{items.length !== 1 ? 's' : ''} in your cart
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(258 90% 66%)' }} />
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>auto-saved</p>
                  </div>
                </div>

                {/* Item cards */}
                {items.map((item, i) => (
                  <CartItemCard
                    key={item._id}
                    item={item}
                    index={i}
                    isUpdating={isUpdating}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}

                {/* Free shipping progress bar */}
                {subtotal < 100 && subtotal > 0 && (
                  <div
                    className="rounded-2xl p-5 opacity-0"
                    style={{
                      background: 'hsl(224 18% 7%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      animation: `slideUp 0.5s cubic-bezier(0.23,1,0.32,1) ${items.length * 80 + 100}ms forwards`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" style={{ color: 'hsl(258 90% 72%)' }} />
                        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          Add{' '}
                          <span
                            className="font-bold"
                            style={{ color: 'hsl(258 90% 72%)' }}
                          >
                            ${(100 - subtotal).toFixed(2)}
                          </span>{' '}
                          more for free shipping
                        </p>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {Math.round((subtotal / 100) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                          background: 'linear-gradient(90deg, hsl(258 90% 66%), hsl(327 80% 62%))',
                          boxShadow: '0 0 8px hsl(258 90% 66% / 0.5)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Achieved free shipping banner */}
                {subtotal >= 100 && (
                  <div
                    className="rounded-2xl px-5 py-4 flex items-center gap-3 opacity-0"
                    style={{
                      background: 'rgba(110,231,183,0.06)',
                      border: '1px solid rgba(110,231,183,0.2)',
                      animation: `slideUp 0.5s cubic-bezier(0.23,1,0.32,1) ${items.length * 80 + 100}ms forwards`,
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(110,231,183)' }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'rgb(110,231,183)' }}>
                        Free shipping unlocked!
                      </p>
                      <p className="text-[11px]" style={{ color: 'rgba(110,231,183,0.6)' }}>
                        Your order qualifies for complimentary delivery
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: summary */}
              <div
                className="space-y-4 opacity-0"
                style={{ animation: 'slideUp 0.5s cubic-bezier(0.23,1,0.32,1) 350ms forwards' }}
              >
                <PromoSection
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  promoApplied={promoApplied}
                  promoDiscount={promoDiscount}
                  onApply={applyPromo}
                />

                <OrderSummaryPanel
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  promoDiscount={promoDiscount}
                  total={total}
                />
              </div>
            </div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-10px); }
        }

        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  );
}

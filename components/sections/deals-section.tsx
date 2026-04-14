'use client'

import { Flame, Clock, ArrowRight, Zap, Tag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'

function useCountdown(hours = 6) {
  const [time, setTime] = useState({ h: hours, m: 0, s: 0 })
  useEffect(() => {
    const end = Date.now() + hours * 3600 * 1000
    const tick = () => {
      const diff = Math.max(0, end - Date.now())
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hours])
  return time
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(0_84%_60%/0.12)] border border-[hsl(0_84%_60%/0.2)]">
        <span className="text-xl font-bold text-[hsl(0_84%_65%)] font-mono tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</span>
    </div>
  )
}

export function DealsSection() {
  const [flashDeals, setFlashDeals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const time = useCountdown(5)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    API.get('/products/deals/all')
      .then(r => setFlashDeals(r.data || []))
      .catch(() => toast.error('Failed to load flash deals'))
      .finally(() => setIsLoading(false))
  }, [])

  const STATIC_DEALS = [
    { _id: 's1', name: 'Sony WH-1000XM5 Headphones', price: 279, originalPrice: 399, discount: 30, image: '🎧', timeLeft: null },
    { _id: 's2', name: 'Samsung 65" 4K QLED TV', price: 899, originalPrice: 1299, discount: 31, image: '📺', timeLeft: null },
    { _id: 's3', name: 'Apple AirPods Pro 2nd Gen', price: 199, originalPrice: 249, discount: 20, image: '🎵', timeLeft: null },
    { _id: 's4', name: 'Dyson V15 Detect Vacuum', price: 449, originalPrice: 649, discount: 31, image: '🌀', timeLeft: null },
  ]

  const deals = flashDeals.length > 0 ? flashDeals.slice(0, 4) : STATIC_DEALS

  return (
    <section id="deals" className="relative py-24 overflow-hidden">
      {/* Fire-like ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[hsl(0_84%_60%/0.05)] blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-[hsl(25_90%_55%/0.04)] blur-[60px]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className={`mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-[hsl(0_84%_60%/0.1)] border border-[hsl(0_84%_60%/0.2)] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(0_84%_65%)] animate-pulse" />
                <span className="text-sm font-bold text-[hsl(0_84%_65%)] uppercase tracking-widest">Live Flash Sale</span>
                <Flame className="h-4 w-4 text-[hsl(25_90%_55%)]" />
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-foreground">Limited </span>
              <span style={{ background: 'linear-gradient(135deg, hsl(0 84% 65%), hsl(25 90% 55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Time Deals</span>
            </h2>
            <p className="text-muted-foreground">Exclusive offers that disappear when the timer hits zero.</p>
          </div>

          {/* Live countdown */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5" /> Ends in
            </div>
            <div className="flex items-center gap-2">
              <CountdownUnit value={time.h} label="HRS" />
              <span className="text-2xl font-bold text-[hsl(0_84%_65%)] -mt-4">:</span>
              <CountdownUnit value={time.m} label="MIN" />
              <span className="text-2xl font-bold text-[hsl(0_84%_65%)] -mt-4">:</span>
              <CountdownUnit value={time.s} label="SEC" />
            </div>
          </div>
        </div>

        {/* Deals grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-3xl bg-[hsl(224_18%_9%)] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal: any, i: number) => (
              <Link
                key={deal._id}
                href={`/product/${deal._id}`}
                className={`group relative overflow-hidden rounded-3xl border bg-[hsl(224_18%_7%)] transition-all duration-500 hover:-translate-y-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{
                  borderColor: 'hsl(0 84% 60% / 0.15)',
                  transitionDelay: `${i * 80}ms`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 20px 60px hsl(0 84% 60% / 0.2), 0 0 0 1px hsl(0 84% 60% / 0.2)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)')}
              >
                {/* Discount badge */}
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-br from-[hsl(0_84%_60%)] to-[hsl(25_90%_55%)] px-3 py-2 text-sm font-bold text-white shadow-[0_0_15px_hsl(0_84%_60%/0.5)] z-10">
                  -{deal.discount}%
                </div>

                {/* Image area */}
                <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-[hsl(0_84%_60%/0.06)] to-[hsl(25_90%_55%/0.04)]">
                  <span className="text-6xl transition-transform duration-300 group-hover:scale-110">🛍️</span>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-white transition-colors">{deal.name}</h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">₹{deal.price?.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{deal.originalPrice?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[hsl(142_71%_45%)] font-semibold bg-[hsl(142_71%_45%/0.1)] px-2 py-0.5 rounded-lg">
                      Save ₹{(deal.originalPrice - deal.price).toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[hsl(0_84%_65%)] font-medium">
                      <Tag className="h-3 w-3" /> Hot deal
                    </span>
                  </div>

                  <button className="w-full rounded-2xl bg-gradient-to-r from-[hsl(0_84%_60%)] to-[hsl(25_90%_55%)] py-2.5 text-sm font-bold text-white shadow-[0_4px_15px_hsl(0_84%_60%/0.3)] hover:shadow-[0_6px_25px_hsl(0_84%_60%/0.5)] transition-all duration-200 flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 fill-current" /> Grab Deal
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View all */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/deals" className="group inline-flex items-center gap-3 rounded-2xl border border-[hsl(0_84%_60%/0.25)] bg-[hsl(0_84%_60%/0.06)] px-8 py-4 text-sm font-semibold text-[hsl(0_84%_65%)] hover:bg-[hsl(0_84%_60%/0.12)] hover:border-[hsl(0_84%_60%/0.4)] transition-all duration-200">
            <Flame className="h-5 w-5" />
            View All Deals
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

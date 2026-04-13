'use client'

import { ArrowRight, ShoppingBag, Star, TrendingUp, Shield, Truck, Headphones, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const FLOATING_CARDS = [
  { icon: '🎧', name: 'Pro Headphones', price: '$299', top: '8%', left: '2%', delay: 0 },
  { icon: '⌚', name: 'Smart Watch', price: '$449', top: '62%', left: '0%', delay: 0.8 },
  { icon: '📱', name: 'iPhone 16 Pro', price: '$1199', top: '10%', right: '0%', delay: 0.4 },
  { icon: '💻', name: 'MacBook Air', price: '$999', top: '65%', right: '1%', delay: 1.2 },
]

const TICKER_ITEMS = ['Free Shipping on Orders $50+', '24/7 Customer Support', '30-Day Easy Returns', 'Secure Payments', 'Exclusive Member Deals']

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setTickerIndex(i => (i + 1) % TICKER_ITEMS.length), 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const px = (mousePos.x - 0.5) * 20
  const py = (mousePos.y - 0.5) * 10

  return (
    <section ref={heroRef} className="relative overflow-hidden mesh-gradient min-h-[90vh] flex flex-col">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ transform: `translate(${px * 0.3}px, ${py * 0.3}px)` }}>
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[hsl(258_90%_66%/0.08)] blur-[100px] animate-blob" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[hsl(327_80%_62%/0.07)] blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[hsl(186_90%_50%/0.05)] blur-[80px] animate-blob" style={{ animationDelay: '6s' }} />
      </div>

      {/* Ticker */}
      <div className="relative z-10 border-b border-white/5 bg-[hsl(258_90%_66%/0.05)] py-2.5">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-center gap-3">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(258_90%_70%)] flex-shrink-0" />
          <div className="overflow-hidden h-5 relative w-72">
            {TICKER_ITEMS.map((item, i) => (
              <p key={i} className={`absolute inset-0 text-center text-xs font-medium text-[hsl(258_90%_72%)] transition-all duration-500 ${i === tickerIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{item}</p>
            ))}
          </div>
          <Sparkles className="h-3.5 w-3.5 text-[hsl(258_90%_70%)] flex-shrink-0" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left */}
            <div className={`space-y-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="section-label"><Zap className="h-3 w-3" />New Collection 2026</span>
                <span className="flex items-center gap-1 rounded-full bg-[hsl(43_96%_56%/0.1)] border border-[hsl(43_96%_56%/0.2)] px-2.5 py-1 text-xs font-semibold text-[hsl(43_96%_60%)]">
                  <TrendingUp className="h-3 w-3" /> Trending
                </span>
              </div>

              <h1 className="font-display text-5xl font-bold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl">
                <span className="text-foreground block">Shop the</span>
                <span className="block gradient-text">Future of</span>
                <span className="text-foreground block">Commerce</span>
              </h1>

              <p className={`text-lg text-muted-foreground leading-relaxed max-w-xl ${mounted ? 'animate-fade-in-up delay-200 opacity-0' : 'opacity-0'}`}>
                Discover a curated universe of premium products with AI-powered recommendations, one-click checkout, and same-day delivery.
              </p>

              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${mounted ? 'animate-fade-in-up delay-300 opacity-0' : 'opacity-0'}`}>
                <Link href="/products" className="group btn-primary text-base px-8 py-4 rounded-2xl">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/deals" className="btn-outline text-base px-8 py-4 rounded-2xl">🔥 Flash Deals</Link>
              </div>

              <div className={`flex flex-wrap gap-3 ${mounted ? 'animate-fade-in-up delay-400 opacity-0' : 'opacity-0'}`}>
                {[
                  { icon: Truck, text: 'Free Delivery', sub: 'Over $50' },
                  { icon: Shield, text: 'Secure Pay', sub: '256-bit SSL' },
                  { icon: Headphones, text: '24/7 Support', sub: 'Always here' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-center gap-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(258_90%_66%/0.1)]">
                      <Icon className="h-4 w-4 text-[hsl(258_90%_70%)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{text}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`flex gap-10 pt-2 ${mounted ? 'animate-fade-in-up delay-500 opacity-0' : 'opacity-0'}`}>
                {[['2M+', 'Happy Customers'], ['50K+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-bold font-display gradient-text">{val}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div
              className={`relative hidden lg:block ${mounted ? 'animate-fade-in delay-300 opacity-0' : 'opacity-0'}`}
              style={{ transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)` }}
            >
              <div className="relative mx-auto h-[520px] w-[520px]">
                {/* Spinning rings */}
                <div className="absolute inset-0 rounded-full border border-[hsl(258_90%_66%/0.12)] animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-[hsl(327_80%_62%/0.09)] animate-spin-reverse" />
                <div className="absolute inset-16 rounded-full border border-[hsl(186_90%_50%/0.07)] animate-spin-slow" style={{ animationDuration: '20s' }} />

                {/* Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-72 w-72">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(258_90%_66%/0.2)] to-[hsl(327_80%_62%/0.15)] blur-3xl animate-pulse" />
                    <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[hsl(224_18%_10%)] to-[hsl(224_18%_7%)] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_0_hsl(258_90%_66%/0.1),0_0_80px_hsl(258_90%_66%/0.15)]">
                      <div className="text-center space-y-3 animate-float">
                        <div className="text-7xl">🛍️</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Premium Collection</p>
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-[hsl(43_96%_56%)] text-[hsl(43_96%_56%)]" />)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">4.9 · 28K reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating product cards */}
                {FLOATING_CARDS.map((card, i) => (
                  <div key={i} className="absolute animate-float" style={{ top: card.top, left: card.left, right: card.right, animationDelay: `${card.delay}s`, animationDuration: `${4 + i * 0.5}s` }}>
                    <div className="flex items-center gap-2.5 rounded-2xl bg-[hsl(224_18%_9%/0.95)] border border-white/[0.07] px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-foreground whitespace-nowrap">{card.name}</p>
                        <p className="text-xs font-bold text-[hsl(258_90%_70%)]">{card.price}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Orbit dots */}
                {[
                  { top: '3%', left: '50%', color: 'hsl(258 90% 66%)' },
                  { top: '25%', left: '91%', color: 'hsl(327 80% 62%)' },
                  { top: '75%', left: '91%', color: 'hsl(258 90% 66%)' },
                  { top: '97%', left: '50%', color: 'hsl(327 80% 62%)' },
                  { top: '75%', left: '9%', color: 'hsl(258 90% 66%)' },
                  { top: '25%', left: '9%', color: 'hsl(327 80% 62%)' },
                ].map((dot, i) => (
                  <div key={`orbit-dot-${i}`} className="absolute h-2 w-2 rounded-full" style={{ top: dot.top, left: dot.left, background: dot.color, boxShadow: `0 0 8px ${dot.color}`, opacity: 0.7 }} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

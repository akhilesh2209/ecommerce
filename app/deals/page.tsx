'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Clock, Zap, TrendingDown, ArrowRight, Bell, Flame, Timer, Tag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'

// ─── Skeleton ─────────────────────────────────────────────────────

function DealCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="h-44 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="p-4 space-y-3">
        <div className="h-3.5 w-3/4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
        <div className="h-10 w-full rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  )
}

// ─── Section styles ────────────────────────────────────────────────

const SECTION_STYLES = [
  { icon: Zap,         color: '#f59e0b', glow: 'rgba(245,158,11,0.15)',   bg: 'rgba(245,158,11,0.08)',   btnGrad: 'linear-gradient(135deg,#d97706,#ea580c)', accent: '#f59e0b' },
  { icon: Flame,       color: '#ef4444', glow: 'rgba(239,68,68,0.15)',    bg: 'rgba(239,68,68,0.08)',    btnGrad: 'linear-gradient(135deg,#dc2626,#be123c)', accent: '#f87171' },
  { icon: TrendingDown,color: '#818cf8', glow: 'rgba(129,140,248,0.15)', bg: 'rgba(129,140,248,0.08)',  btnGrad: 'linear-gradient(135deg,#6366f1,#7c3aed)', accent: '#818cf8' },
]

// ─── Countdown ────────────────────────────────────────────────────

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 })
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev; s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2">
      {[time.h, time.m, time.s].map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: 'hsl(224 18% 9%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
            {pad(val)}
          </div>
          {i < 2 && <span className="font-bold text-xl" style={{ color: 'rgba(255,255,255,0.25)' }}>:</span>}
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function DealsPage() {
  const [dealsData, setDealsData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await API.get('/deals')
        setDealsData(res.data)
      } catch (error) {
        toast.error('Failed to load deals')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDeals()
  }, [])

  const DEALS_BY_CATEGORY = [
    { category: 'Flash Deals',    description: 'Lightning-fast savings — refreshed every hour', icon: Zap,          deals: dealsData.flash     || [], style: SECTION_STYLES[0] },
    { category: 'Clearance Sale', description: 'Up to 70% off — while stocks last',              icon: Flame,        deals: dealsData.clearance || [], style: SECTION_STYLES[1] },
    { category: 'Weekly Specials',description: "Our editors' picks for the week",                icon: TrendingDown, deals: dealsData.weekly    || [], style: SECTION_STYLES[2] },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.06]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05]" style={{ background: '#ef4444' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <Navbar />
      <main className="relative overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative max-w-4xl mx-auto space-y-8">
            <div className="opacity-0" style={{ animation: 'slideUp 0.5s ease 50ms forwards' }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Flame className="w-3.5 h-3.5" /> Limited Time Offers
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-white leading-tight opacity-0"
              style={{ fontFamily: "'Syne', sans-serif", animation: 'slideUp 0.5s ease 150ms forwards' }}>
              Amazing Deals &
              <br />
              <span style={{
                background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%), hsl(185 100% 60%))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Discounts</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto opacity-0"
              style={{ color: 'rgba(255,255,255,0.45)', animation: 'slideUp 0.5s ease 250ms forwards' }}>
              Don't miss out on our incredible savings across thousands of premium products.
            </p>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-4 opacity-0" style={{ animation: 'slideUp 0.5s ease 350ms forwards' }}>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <Timer className="w-4 h-4" style={{ color: 'hsl(258 90% 72%)' }} />
                Flash deals refresh in:
              </div>
              <CountdownTimer />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 space-y-20">

          {isLoading ? (
            <div className="space-y-16">
              {[1,2,3].map(section => (
                <div key={section} className="space-y-6">
                  <div className="h-8 w-56 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1,2,3,4].map(i => <DealCardSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {DEALS_BY_CATEGORY.filter(s => s.deals.length > 0).map((section) => {
                const Icon = section.icon
                const style = section.style
                return (
                  <div key={section.category} className="space-y-8">

                    {/* Section header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: style.bg, border: `1px solid ${style.color}25` }}>
                          <Icon className="w-5 h-5" style={{ color: style.color }} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{section.category}</h2>
                          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{section.description}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all group"
                        style={{ color: style.accent }}>
                        View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Deal cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {section.deals.map((deal: any, i: number) => (
                        <Link key={deal._id} href={`/product/${deal._id}`}
                          className="group relative rounded-2xl overflow-hidden opacity-0"
                          style={{
                            background: 'hsl(224 18% 7%)',
                            border: `1px solid ${style.color}18`,
                            animation: `slideUp 0.5s ease ${i * 80}ms forwards`,
                            transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.4s',
                          }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${style.color}40`; el.style.boxShadow = `0 20px 60px ${style.color}12`; el.style.transform = 'translateY(-6px)' }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${style.color}18`; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>

                          {/* Image */}
                          <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(224 18% 9%), hsl(224 18% 12%))` }}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `radial-gradient(ellipse at 50% 100%, ${style.glow}, transparent 70%)` }} />
                            {deal.image && deal.image.startsWith('http') ? (
                              <img src={deal.image} alt={deal.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110">🏷️</div>
                            )}

                            {/* Discount badge */}
                            <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                              style={{ background: style.btnGrad, boxShadow: `0 4px 12px ${style.color}40` }}>
                              −{deal.discount}%
                            </div>

                            {/* Time left */}
                            {deal.timeLeft && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg"
                                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                                <Clock className="w-3 h-3" />{deal.timeLeft}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-sm leading-snug line-clamp-2 transition-colors"
                              style={{ color: 'rgba(255,255,255,0.8)' }}>
                              {deal.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>${deal.price}</span>
                              <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>${deal.originalPrice}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'rgb(110,231,183)' }}>
                              <Tag className="w-3 h-3" />
                              You save ${(deal.originalPrice - deal.price).toFixed(2)}
                            </div>
                            <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300"
                              style={{ background: style.btnGrad, boxShadow: `0 4px 16px ${style.color}30` }}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = `0 8px 24px ${style.color}45` }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = `0 4px 16px ${style.color}30` }}>
                              Grab Deal
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}

              {DEALS_BY_CATEGORY.every(s => s.deals.length === 0) && (
                <div className="text-center py-24 space-y-5">
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', animation: 'float 5s ease-in-out infinite' }}>
                    <Tag className="w-9 h-9" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No deals right now</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Check back soon — new deals drop every hour.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Newsletter ── */}
          <div className="relative overflow-hidden rounded-3xl p-12 text-center space-y-7"
            style={{ background: 'linear-gradient(135deg, hsl(258 90% 8%), hsl(270 60% 12%), hsl(258 90% 8%))', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: 'hsl(258 90% 66%)' }} />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-[80px] opacity-15" style={{ background: 'hsl(327 80% 62%)' }} />
            <div className="relative z-10 space-y-7">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Never Miss a Deal</h2>
                <p className="max-w-lg mx-auto text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Get notified about flash sales, exclusive offers, and curated promotions — delivered straight to your inbox.
                </p>
              </div>
              <div className="flex gap-2 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontFamily: 'inherit' }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = 'hsl(258 90% 66% / 0.5)'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px hsl(258 90% 66% / 0.1)' }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.target as HTMLElement).style.boxShadow = 'none' }} />
                <button
                  onClick={() => { if (email) { toast.success("You're subscribed! 🎉"); setEmail('') } else toast.error("Enter your email") }}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white whitespace-nowrap transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                  Subscribe
                </button>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  )
}
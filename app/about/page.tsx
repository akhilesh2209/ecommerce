'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Award, Users, Globe, Zap, ArrowRight, Star, Heart, TrendingUp } from 'lucide-react'

const stats = [
  { value: "2M+",  label: "Happy Customers", icon: Users,      color: "#818cf8" },
  { value: "50K+", label: "Products",         icon: Award,      color: "#f59e0b" },
  { value: "150+", label: "Countries",        icon: Globe,      color: "#34d399" },
  { value: "12+",  label: "Years of Trust",   icon: TrendingUp, color: "#c084fc" },
]

const values = [
  { icon: Award, title: 'Quality First',       description: 'Every product is meticulously curated by our expert buyers to meet our exacting standards of excellence.',                         iconColor: '#f59e0b', border: 'rgba(245,158,11,0.2)',   glow: '#f59e0b' },
  { icon: Heart, title: 'Customer Obsessed',   description: 'Your delight is our north star. Every decision we make starts and ends with you, our valued customer.',                           iconColor: '#f43f5e', border: 'rgba(244,63,94,0.2)',    glow: '#f43f5e' },
  { icon: Zap,   title: 'Always Innovating',   description: 'We harness cutting-edge technology to make your shopping experience faster, smarter, and more personal.',                         iconColor: '#8b5cf6', border: 'rgba(139,92,246,0.2)',   glow: '#8b5cf6' },
  { icon: Globe, title: 'Global Reach',        description: 'Serving customers across 150+ countries with local expertise and worldwide logistics excellence.',                                 iconColor: '#10b981', border: 'rgba(16,185,129,0.2)',   glow: '#10b981' },
]

const team = [
  { name: 'Alice Johnson', role: 'Founder & CEO',            avatar: '👩‍💼', quote: 'Building tomorrow, today.',        accent: '#818cf8' },
  { name: 'Bob Smith',     role: 'Chief Technology Officer', avatar: '👨‍💼', quote: 'Code is craft.',                   accent: '#34d399' },
  { name: 'Carol White',   role: 'Head of Operations',       avatar: '👩‍🏫', quote: 'Excellence in every detail.',      accent: '#f59e0b' },
  { name: 'David Brown',   role: 'Director of Sales',        avatar: '👨‍🎓', quote: 'Growth through relationships.',    accent: '#c084fc' },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full"
      style={{ color: 'hsl(258 90% 72%)', background: 'hsl(258 90% 66% / 0.1)', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
      {children}
    </p>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] opacity-[0.06]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]" style={{ background: 'hsl(327 80% 62%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </div>

      <Navbar />
      <main className="relative overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.03)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.04)' }} />
          <div className="relative max-w-4xl mx-auto space-y-8">
            <div className="opacity-0" style={{ animation: 'slideUp 0.6s ease 50ms forwards' }}>
              <SectionLabel>Our Story</SectionLabel>
            </div>
            <h1 className="text-6xl sm:text-8xl font-bold leading-none tracking-tight text-white opacity-0"
              style={{ fontFamily: "'Syne', sans-serif", animation: 'slideUp 0.6s ease 150ms forwards' }}>
              We're
              <br />
              <span style={{
                background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%), hsl(185 100% 60%))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>redefining</span>
              <br />
              e-commerce
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto opacity-0"
              style={{ color: 'rgba(255,255,255,0.45)', animation: 'slideUp 0.6s ease 250ms forwards' }}>
              PrimeStore was born from a simple belief: shopping should be an experience, not a transaction.
              Since 2012, we've been building something extraordinary.
            </p>
            <div className="flex items-center justify-center gap-5 opacity-0" style={{ animation: 'slideUp 0.6s ease 350ms forwards' }}>
              <div className="flex -space-x-3">
                {["🧑", "👩", "👨", "👩‍🦱", "🧔"].map((e, i) => (
                  <div key={i} className="w-11 h-11 rounded-full flex items-center justify-center text-lg border-2 hover:-translate-y-1 transition-transform"
                    style={{ background: 'hsl(224 18% 10%)', borderColor: 'hsl(224 20% 4%)', zIndex: 5 - i }}>
                    {e}
                  </div>
                ))}
              </div>
              <div className="text-left border-l pl-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Trusted by 2M+ customers worldwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon, color }, i) => (
              <div key={label}
                className="group relative rounded-2xl p-7 text-center overflow-hidden cursor-default opacity-0"
                style={{
                  background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)',
                  animation: `slideUp 0.5s ease ${200 + i * 80}ms forwards`, transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${color}40`; el.style.boxShadow = `0 0 40px ${color}15`; el.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}10, transparent 70%)` }} />
                <Icon className="w-6 h-6 mx-auto mb-4" style={{ color }} />
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color }}>{value}</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl p-10 space-y-6"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 10%), hsl(270 60% 14%))', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
              <div className="absolute top-0 right-0 w-52 h-52 rounded-full -translate-y-1/3 translate-x-1/3"
                style={{ background: 'radial-gradient(circle, hsl(258 90% 66% / 0.15), transparent 70%)' }} />
              <SectionLabel>Purpose</SectionLabel>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Our Mission</h2>
              <div className="w-14 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, hsl(258 90% 66%), transparent)' }} />
              <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                To provide customers with the finest shopping experience by offering high-quality products, transparent pricing, and exceptional service — delivered with the warmth and care of a local boutique at global scale.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold cursor-pointer group w-fit" style={{ color: 'hsl(258 90% 72%)' }}>
                Read our story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-10 space-y-6"
              style={{ background: 'linear-gradient(135deg, hsl(327 80% 10%), hsl(340 60% 14%))', border: '1px solid hsl(327 80% 62% / 0.2)' }}>
              <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full translate-y-1/3 -translate-x-1/3"
                style={{ background: 'radial-gradient(circle, hsl(327 80% 62% / 0.15), transparent 70%)' }} />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(327 80% 68%)' }}>Direction</p>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Our Vision</h2>
              <div className="w-14 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, hsl(327 80% 62%), transparent)' }} />
              <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                To become the world's most trusted and beloved marketplace — a place where every customer feels understood, valued, and inspired to discover products that genuinely improve their lives.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold cursor-pointer group w-fit" style={{ color: 'hsl(327 80% 68%)' }}>
                Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-center space-y-4">
              <SectionLabel>What We Stand For</SectionLabel>
              <h2 className="text-5xl font-bold text-white mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description, iconColor, border, glow }, i) => (
                <div key={title}
                  className="group relative rounded-2xl p-7 space-y-5 overflow-hidden cursor-default opacity-0"
                  style={{
                    background: 'hsl(224 18% 7%)', border: `1px solid ${border}`,
                    animation: `slideUp 0.5s ease ${300 + i * 80}ms forwards`, transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 20px 60px ${glow}15` }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 30% 0%, ${glow}08, transparent 60%)` }} />
                  <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}>
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                  <h3 className="relative font-bold text-white text-base" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
                  <p className="relative text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-center space-y-4">
              <SectionLabel>The People</SectionLabel>
              <h2 className="text-5xl font-bold text-white mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>Meet the Team</h2>
              <p className="max-w-xl mx-auto text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                A passionate group of builders, dreamers, and operators united by a love for exceptional retail.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <div key={member.name}
                  className="group relative rounded-2xl overflow-hidden opacity-0"
                  style={{
                    background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)',
                    animation: `slideUp 0.5s ease ${300 + i * 80}ms forwards`, transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.4s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${member.accent}40`; el.style.boxShadow = `0 20px 60px ${member.accent}15`; el.style.transform = 'translateY(-5px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}>
                  <div className="h-52 flex items-center justify-center text-6xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(224 18% 9%), hsl(224 18% 12%))' }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at 50% 100%, ${member.accent}18, transparent 70%)` }} />
                    <span className="relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 inline-block">
                      {member.avatar}
                    </span>
                  </div>
                  <div className="p-6 space-y-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <h3 className="font-bold text-white text-sm">{member.name}</h3>
                    <p className="text-xs font-semibold" style={{ color: member.accent }}>{member.role}</p>
                    <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Playfair Display', serif" }}>"{member.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl p-16 text-center space-y-7"
            style={{ background: 'linear-gradient(135deg, hsl(258 90% 8%), hsl(270 70% 12%), hsl(258 90% 8%))', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: 'hsl(258 90% 66%)' }} />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-[80px] opacity-15" style={{ background: 'hsl(327 80% 62%)' }} />
            <div className="relative z-10 space-y-7">
              <SectionLabel>Join Us</SectionLabel>
              <h2 className="text-4xl font-bold text-white mt-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                Ready to experience<br />the difference?
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Shop over 50,000 premium products with absolute confidence.</p>
              <a href="/products"
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-sm font-bold text-white transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.4)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 48px hsl(258 90% 66% / 0.55)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.4)' }}>
                Start Shopping <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
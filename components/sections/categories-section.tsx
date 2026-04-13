'use client'

import Link from 'next/link'
import { ArrowRight, Grid3x3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const CATEGORIES = [
  { id: 1, name: 'Electronics', emoji: '💻', count: 2840, href: '/products/electronics', color: 'hsl(217 91% 60%)', glow: 'hsl(217 91% 60% / 0.15)', gradient: 'from-[hsl(217_91%_60%/0.12)] to-[hsl(186_90%_50%/0.06)]' },
  { id: 2, name: 'Fashion', emoji: '👗', count: 5120, href: '/products/fashion', color: 'hsl(327 80% 62%)', glow: 'hsl(327 80% 62% / 0.15)', gradient: 'from-[hsl(327_80%_62%/0.12)] to-[hsl(350_85%_65%/0.06)]' },
  { id: 3, name: 'Home & Garden', emoji: '🏡', count: 3450, href: '/products/home', color: 'hsl(142 71% 45%)', glow: 'hsl(142 71% 45% / 0.15)', gradient: 'from-[hsl(142_71%_45%/0.12)] to-[hsl(160_80%_40%/0.06)]' },
  { id: 4, name: 'Sports', emoji: '⚽', count: 1890, href: '/products', color: 'hsl(25 90% 55%)', glow: 'hsl(25 90% 55% / 0.15)', gradient: 'from-[hsl(25_90%_55%/0.12)] to-[hsl(43_96%_56%/0.06)]' },
  { id: 5, name: 'Books', emoji: '📚', count: 4230, href: '/products', color: 'hsl(258 90% 66%)', glow: 'hsl(258 90% 66% / 0.15)', gradient: 'from-[hsl(258_90%_66%/0.12)] to-[hsl(280_85%_65%/0.06)]' },
  { id: 6, name: 'Toys & Games', emoji: '🎮', count: 2560, href: '/products', color: 'hsl(43 96% 56%)', glow: 'hsl(43 96% 56% / 0.15)', gradient: 'from-[hsl(43_96%_56%/0.12)] to-[hsl(25_90%_55%/0.06)]' },
]

export function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative py-24 bg-[hsl(224_18%_5%/0.5)]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(224_18%_5%/0.3)] to-transparent pointer-events-none" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 text-center space-y-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label"><Grid3x3 className="h-3 w-3" />Shop by Category</span>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-foreground">Browse </span>
            <span className="gradient-text">Collections</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Explore our diverse range of categories to find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[hsl(224_18%_7%)] p-8 transition-all duration-500 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* BG gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ boxShadow: `inset 0 0 0 1px ${cat.color}40, 0 20px 60px ${cat.glow}` }} />

              <div className="relative flex flex-col h-full gap-6">
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${cat.color}14`, boxShadow: `0 0 20px ${cat.glow}` }}
                  >
                    {cat.emoji}
                  </div>
                  <div
                    className="rounded-xl px-2.5 py-1 text-xs font-bold"
                    style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}
                  >
                    {cat.count.toLocaleString()}+
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.count.toLocaleString()} products</p>
                </div>

                {/* CTA */}
                <div className="mt-auto flex items-center gap-2 text-sm font-semibold transition-all duration-200" style={{ color: cat.color }}>
                  Explore collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

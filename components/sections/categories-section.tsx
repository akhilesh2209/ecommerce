'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    emoji: '💻',
    count: 2840,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 2,
    name: 'Fashion',
    emoji: '👗',
    count: 5120,
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 3,
    name: 'Home & Garden',
    emoji: '🏡',
    count: 3450,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 4,
    name: 'Sports',
    emoji: '⚽',
    count: 1890,
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    id: 5,
    name: 'Books',
    emoji: '📚',
    count: 4230,
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
  {
    id: 6,
    name: 'Toys & Games',
    emoji: '🎮',
    count: 2560,
    gradient: 'from-yellow-500/20 to-amber-500/20',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            SHOP BY CATEGORY
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Browse Collections
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore our diverse range of categories to find exactly what you{"'"}re looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}></div>

              {/* Content */}
              <div className="relative p-8 space-y-6 flex flex-col h-full">
                <div>
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
                    {category.emoji}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.count.toLocaleString()} products
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="mt-auto inline-flex items-center space-x-2 text-accent font-medium group-hover:space-x-4 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

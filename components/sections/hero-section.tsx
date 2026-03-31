'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 py-20 sm:py-32">
      {/* Decorative Elements */}
      <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute -left-48 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                Welcome to PrimeStore
              </span>
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                Discover Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Perfect</span> Product
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Shop curated collections with AI-powered recommendations. Enjoy seamless checkout, lightning-fast delivery, and exceptional customer service.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-elevation"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#deals"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-accent text-accent font-semibold hover:bg-accent/10 transition-all duration-200"
              >
                View Deals
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">2M+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>

          {/* Hero Image - Placeholder gradient */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-32 w-32 rounded-full bg-white/10 backdrop-blur-glass flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent opacity-80"></div>
                </div>
                <p className="mt-4 text-white/60 text-sm">Premium Featured Product</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

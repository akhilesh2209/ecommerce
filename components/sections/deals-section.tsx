'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'

const FLASH_DEALS = [
  {
    id: 1,
    name: 'Premium Laptop Stand',
    discount: 45,
    timeLeft: '2h 34m',
    price: 49.99,
    originalPrice: 89.99,
  },
  {
    id: 2,
    name: 'Wireless Charger Pro',
    discount: 35,
    timeLeft: '5h 12m',
    price: 24.99,
    originalPrice: 39.99,
  },
  {
    id: 3,
    name: 'USB-C Cable 3-Pack',
    discount: 50,
    timeLeft: '1h 45m',
    price: 9.99,
    originalPrice: 19.99,
  },
  {
    id: 4,
    name: 'Phone Case Bundle',
    discount: 40,
    timeLeft: '3h 20m',
    price: 14.99,
    originalPrice: 24.99,
  },
]

export function DealsSection() {
  return (
    <section id="deals" className="py-20 sm:py-32 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-2 rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">FLASH SALE</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Limited Time Deals
          </h2>
          <p className="text-lg text-muted-foreground">
            Grab these exclusive offers before they{"'"}re gone. Prices update hourly.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {FLASH_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="group relative overflow-hidden rounded-lg border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-900 shadow-subtle hover:shadow-elevation transition-all duration-300"
            >
              {/* Discount Badge */}
              <div className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-3 py-2 text-sm font-bold text-white">
                -{deal.discount}%
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="line-clamp-2 font-semibold text-foreground">
                  {deal.name}
                </h3>

                {/* Prices */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-foreground">
                    ${deal.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${deal.originalPrice}
                  </span>
                </div>

                {/* Timer */}
                <div className="flex items-center space-x-2 text-sm font-medium text-red-600 dark:text-red-400">
                  <Clock className="h-4 w-4" />
                  <span>Ends in {deal.timeLeft}</span>
                </div>

                {/* CTA Button */}
                <button className="w-full rounded-lg bg-red-500 text-white py-2 font-medium hover:bg-red-600 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals */}
        <div className="text-center">
          <Link
            href="/deals"
            className="inline-flex px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-elevation"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'

export function DealsSection() {
  const [flashDeals, setFlashDeals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const res = await API.get('/deals')
        setFlashDeals(res.data.flash || [])
      } catch (error) {
        toast.error('Failed to load flash deals')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashDeals()
  }, [])

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
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : flashDeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {flashDeals.slice(0, 4).map((deal: any) => (
              <Link
                key={deal._id}
                href={`/product/${deal._id}`}
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
                  {deal.timeLeft && (
                    <div className="flex items-center space-x-2 text-sm font-medium text-red-600 dark:text-red-400">
                      <Clock className="h-4 w-4" />
                      <span>Ends in {deal.timeLeft}</span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button className="w-full rounded-lg bg-red-500 text-white py-2 font-medium hover:bg-red-600 transition-colors">
                    Buy Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No flash deals available at the moment.
          </div>
        )}

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

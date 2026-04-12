'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Clock, Zap, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'

export default function DealsPage() {
  const [dealsData, setDealsData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await API.get('/deals')
        setDealsData(res.data)
      } catch (error) {
        toast.error('Failed to load deals')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const DEALS_BY_CATEGORY = [
    {
      category: 'Flash Deals',
      description: 'Limited time offers - update every hour',
      icon: Zap,
      color: 'text-yellow-500',
      deals: dealsData.flash || [],
    },
    {
      category: 'Clearance Sale',
      description: 'Up to 70% off selected items',
      icon: TrendingDown,
      color: 'text-red-500',
      deals: dealsData.clearance || [],
    },
    {
      category: 'Weekly Specials',
      description: 'Best deals this week',
      icon: Clock,
      color: 'text-blue-500',
      deals: dealsData.weekly || [],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <span className="inline-block rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400">
            SPECIAL OFFERS
          </span>
          <h1 className="text-5xl font-bold text-foreground sm:text-6xl">
            Amazing Deals & Discounts
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Don{"'"}t miss out on our incredible savings. Shop now and save big on premium products.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          /* Deals Sections */
          <div className="space-y-16">
            {DEALS_BY_CATEGORY.filter(section => section.deals.length > 0).map((section) => {
              const Icon = section.icon
              return (
                <div key={section.category} className="space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-8 w-8 ${section.color}`} />
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {section.category}
                      </h2>
                      <p className="text-muted-foreground">{section.description}</p>
                    </div>
                  </div>

                  {/* Deals Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {section.deals.map((deal: any) => (
                      <Link
                        key={deal._id}
                        href={`/product/${deal._id}`}
                        className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-elevation transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Image */}
                        <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                          {deal.image && deal.image.startsWith('http') ? (
                            <img 
                              src={deal.image} 
                              alt={deal.name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                              ????
                            </div>
                          )}

                          {/* Discount Badge */}
                          <div className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-3 py-2 text-sm font-bold text-white">
                            -{deal.discount}%
                          </div>

                          {/* Time Left */}
                          {deal.timeLeft && (
                            <div className="absolute left-0 bottom-0 rounded-tr-lg bg-black/60 backdrop-blur-glass px-3 py-2 text-xs font-semibold text-white flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{deal.timeLeft}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                            {deal.name}
                          </h3>

                          {/* Prices */}
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-foreground">
                              ${deal.price}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${deal.originalPrice}
                            </span>
                          </div>

                          {/* Button */}
                          <button className="w-full rounded-lg bg-primary text-primary-foreground py-2 font-medium hover:bg-primary/90 transition-colors text-sm">
                            View Deal
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Subscribe Section */}
        <div className="mt-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/30 p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Never Miss a Deal Again
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Subscribe to our newsletter to get notified about flash sales, exclusive offers, and special promotions.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="rounded-lg bg-accent text-accent-foreground px-6 py-3 font-semibold hover:bg-accent/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

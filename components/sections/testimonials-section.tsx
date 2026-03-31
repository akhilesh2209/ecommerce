'use client'

import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    author: 'Sarah Anderson',
    role: 'Verified Customer',
    rating: 5,
    text: 'PrimeStore completely changed my online shopping experience. The product quality is exceptional and delivery was faster than expected!',
    avatar: '👩',
  },
  {
    id: 2,
    author: 'Michael Chen',
    role: 'Premium Member',
    rating: 5,
    text: 'Impressed with the customer service team. They resolved my issue within minutes. Highly recommended to anyone looking for a reliable e-commerce platform.',
    avatar: '👨',
  },
  {
    id: 3,
    author: 'Emma Watson',
    role: 'Verified Customer',
    rating: 5,
    text: 'The AI recommendations are spot on. Found exactly what I was looking for without spending hours browsing. Love this platform!',
    avatar: '👩‍🦰',
  },
  {
    id: 4,
    author: 'James Rodriguez',
    role: 'Premium Member',
    rating: 4,
    text: 'Great selection, fair prices, and smooth checkout process. Will definitely be buying from PrimeStore again.',
    avatar: '👨‍🏫',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            CUSTOMER REVIEWS
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Loved by 2 Million Customers
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See what our satisfied customers have to say about their shopping experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-xl border border-border/50 bg-card shadow-subtle p-8 space-y-4 hover:shadow-elevation transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground leading-relaxed italic">
                {`"${testimonial.text}"`}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-4 border-t border-border/50">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-accent">4.9/5</p>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">28K+</p>
            <p className="text-muted-foreground">5-Star Reviews</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-accent">2M+</p>
            <p className="text-muted-foreground">Customers</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">50K+</p>
            <p className="text-muted-foreground">Products</p>
          </div>
        </div>
      </div>
    </section>
  )
}

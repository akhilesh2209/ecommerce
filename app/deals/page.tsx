'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Clock, Zap, TrendingDown, ArrowRight, Bell, Flame, Timer, Tag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { toast } from 'sonner'

const DealCardSkeleton = () => (
  <div className="card-luxury overflow-hidden">
    <div className="shimmer h-44 w-full" />
    <div className="p-4 space-y-3">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-4 w-1/2 rounded" />
      <div className="shimmer h-8 w-full rounded-lg" />
    </div>
  </div>
);

const SECTION_STYLES = [
  {
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Flame,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
    glow: 'shadow-red-500/20',
  },
  {
    icon: TrendingDown,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
    glow: 'shadow-blue-500/20',
  },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {[time.h, time.m, time.s].map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground font-mono-custom text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center">
            {pad(val)}
          </div>
          {i < 2 && <span className="text-muted-foreground font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function DealsPage() {
  const [dealsData, setDealsData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await API.get('/deals');
        setDealsData(res.data);
      } catch (error) {
        toast.error('Failed to load deals');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const DEALS_BY_CATEGORY = [
    {
      category: 'Flash Deals',
      description: 'Lightning-fast savings — refreshed every hour',
      icon: Zap,
      deals: dealsData.flash || [],
      style: SECTION_STYLES[0],
    },
    {
      category: 'Clearance Sale',
      description: 'Up to 70% off — while stocks last',
      icon: Flame,
      deals: dealsData.clearance || [],
      style: SECTION_STYLES[1],
    },
    {
      category: 'Weekly Specials',
      description: "Our editors' picks for the week",
      icon: TrendingDown,
      deals: dealsData.weekly || [],
      style: SECTION_STYLES[2],
    },
  ];

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full opacity-0 animate-fade-in">
              <Flame className="w-3.5 h-3.5" /> Limited Time Offers
            </span>
            <h1 className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-tight opacity-0 animate-fade-in-up delay-100">
              Amazing Deals &
              <br />
              <span className="gradient-text">Discounts</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
              Don't miss out on our incredible savings across thousands of premium products.
            </p>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-in-up delay-300">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4 text-accent" />
                Flash deals refresh in:
              </div>
              <CountdownTimer />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 space-y-20">
          {isLoading ? (
            <div className="space-y-16">
              {[1, 2, 3].map(section => (
                <div key={section} className="space-y-6">
                  <div className="shimmer h-10 w-64 rounded-xl" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1,2,3,4].map(i => <DealCardSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {DEALS_BY_CATEGORY.filter(s => s.deals.length > 0).map((section) => {
                const Icon = section.icon;
                const style = section.style;
                return (
                  <div key={section.category} className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.border} border flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${style.color}`} />
                        </div>
                        <div>
                          <h2 className="font-display text-3xl font-bold text-foreground">{section.category}</h2>
                          <p className="text-muted-foreground text-sm">{section.description}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-sm text-accent font-medium cursor-pointer hover:gap-3 transition-all">
                        View all <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Deals Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {section.deals.map((deal: any, i: number) => (
                        <Link
                          key={deal._id}
                          href={`/product/${deal._id}`}
                          className="card-luxury overflow-hidden group opacity-0 animate-fade-in-up"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          {/* Image */}
                          <div className="relative h-44 bg-warm-gradient overflow-hidden">
                            {deal.image && deal.image.startsWith('http') ? (
                              <img
                                src={deal.image}
                                alt={deal.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-5xl">
                                🏷️
                              </div>
                            )}
                            {/* Discount badge */}
                            <div className={`absolute top-3 right-3 ${style.accent} text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg ${style.glow} shadow-md`}>
                              −{deal.discount}%
                            </div>
                            {/* Time left */}
                            {deal.timeLeft && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-lg">
                                <Clock className="w-3 h-3" />
                                {deal.timeLeft}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                              {deal.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-xl font-bold text-foreground">${deal.price}</span>
                              <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                            </div>
                            {/* Savings pill */}
                            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                              <Tag className="w-3 h-3" />
                              You save ${(deal.originalPrice - deal.price).toFixed(2)}
                            </div>
                            <button className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${style.accent} hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md ${style.glow}`}>
                              Grab Deal
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {DEALS_BY_CATEGORY.every(s => s.deals.length === 0) && (
                <div className="text-center py-24 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto animate-float">
                    <Tag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">No deals right now</h3>
                  <p className="text-muted-foreground">Check back soon — new deals drop every hour.</p>
                </div>
              )}
            </div>
          )}

          {/* Newsletter Subscribe */}
          <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center space-y-6">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, hsl(25 85% 52%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(43 74% 49%) 0%, transparent 50%)`,
            }} />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
                  Never Miss a Deal
                </h2>
                <p className="text-primary-foreground/60 max-w-lg mx-auto">
                  Get notified about flash sales, exclusive offers, and curated promotions — delivered straight to your inbox.
                </p>
              </div>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
                <button
                  onClick={() => { if (email) { toast.success("You're subscribed! 🎉"); setEmail(''); } else toast.error("Enter your email"); }}
                  className="btn-accent px-6 py-3 text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-primary-foreground/40">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
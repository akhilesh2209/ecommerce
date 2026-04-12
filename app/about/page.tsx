'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Award, Users, Globe, Zap, ArrowRight, Star, Heart, TrendingUp } from 'lucide-react'

const stats = [
  { value: "2M+", label: "Happy Customers", icon: Users, color: "text-blue-500" },
  { value: "50K+", label: "Products", icon: Award, color: "text-amber-500" },
  { value: "150+", label: "Countries", icon: Globe, color: "text-green-500" },
  { value: "12+", label: "Years", icon: TrendingUp, color: "text-purple-500" },
];

const values = [
  {
    icon: Award,
    title: 'Quality First',
    description: 'Every product is meticulously curated by our expert buyers to meet our exacting standards of excellence.',
    accent: 'from-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Heart,
    title: 'Customer Obsessed',
    description: 'Your delight is our north star. Every decision we make starts and ends with you, our valued customer.',
    accent: 'from-rose-500/10 to-rose-500/5',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Zap,
    title: 'Always Innovating',
    description: 'We harness cutting-edge technology to make your shopping experience faster, smarter, and more personal.',
    accent: 'from-violet-500/10 to-violet-500/5',
    iconBg: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving customers across 150+ countries with local expertise and worldwide logistics excellence.',
    accent: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
];

const team = [
  { name: 'Alice Johnson', role: 'Founder & CEO', avatar: '👩‍💼', quote: 'Building tomorrow, today.' },
  { name: 'Bob Smith', role: 'Chief Technology Officer', avatar: '👨‍💼', quote: 'Code is craft.' },
  { name: 'Carol White', role: 'Head of Operations', avatar: '👩‍🏫', quote: 'Excellence in every detail.' },
  { name: 'David Brown', role: 'Director of Sales', avatar: '👨‍🎓', quote: 'Growth through relationships.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto space-y-6">
            <p className="section-label opacity-0 animate-fade-in">Our Story</p>
            <h1 className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-tight opacity-0 animate-fade-in-up delay-100">
              We're redefining
              <br />
              <span className="gradient-text">e-commerce</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
              PrimeStore was born from a simple belief: shopping should be an experience, not a transaction. Since 2012, we've been building something extraordinary.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 opacity-0 animate-fade-in-up delay-300">
              <div className="flex -space-x-2">
                {["🧑", "👩", "👨", "👩‍🦱", "🧔"].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-lg">
                    {e}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground">Trusted by 2M+ customers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ value, label, icon: Icon, color }, i) => (
                <div
                  key={label}
                  className="card-luxury p-8 text-center space-y-3 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Icon className={`w-7 h-7 mx-auto ${color}`} />
                  <p className="font-display text-4xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-10 space-y-5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full -translate-y-1/4 translate-x-1/4" />
              <p className="section-label text-accent relative z-10">Purpose</p>
              <h2 className="font-display text-3xl font-bold text-primary-foreground relative z-10">Our Mission</h2>
              <div className="divider relative z-10" />
              <p className="text-primary-foreground/70 leading-relaxed relative z-10">
                To provide customers with the finest shopping experience by offering high-quality products, transparent pricing, and exceptional service — delivered with the warmth and care of a local boutique at global scale.
              </p>
              <div className="flex items-center gap-2 text-accent text-sm font-medium relative z-10 cursor-pointer hover:gap-3 transition-all">
                Read our story <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-accent p-10 space-y-5">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/4 -translate-x-1/4" />
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest relative z-10">Direction</p>
              <h2 className="font-display text-3xl font-bold text-white relative z-10">Our Vision</h2>
              <div className="w-14 h-0.5 bg-white/30 rounded relative z-10" />
              <p className="text-white/75 leading-relaxed relative z-10">
                To become the world's most trusted and beloved marketplace — a place where every customer feels understood, valued, and inspired to discover products that genuinely improve their lives.
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-medium relative z-10 cursor-pointer hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="section-label">What We Stand For</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description, iconBg }, i) => (
                <div
                  key={title}
                  className="card-luxury p-7 space-y-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="section-label">The People</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Meet the Team</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A passionate group of builders, dreamers, and operators united by a love for exceptional retail.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <div
                  key={member.name}
                  className="card-luxury overflow-hidden group opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="h-52 bg-warm-gradient flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                    <span className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                      {member.avatar}
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-accent font-medium">{member.role}</p>
                    <p className="text-xs text-muted-foreground italic font-display">"{member.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 bg-primary rounded-3xl p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 30% 70%, hsl(25 85% 52%) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(43 74% 49%) 0%, transparent 50%)`,
            }} />
            <p className="section-label text-accent relative z-10">Join Us</p>
            <h2 className="font-display text-4xl font-bold text-primary-foreground relative z-10">
              Ready to experience the difference?
            </h2>
            <p className="text-primary-foreground/60 relative z-10">
              Shop over 50,000 premium products with confidence.
            </p>
            <div className="flex items-center justify-center gap-4 relative z-10">
              <a href="/products" className="btn-accent px-8 py-3.5">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
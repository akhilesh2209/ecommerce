import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Home, ShoppingBag, Tag, Info, ArrowRight } from 'lucide-react'

export default function NotFound() {
  const links = [
    { label: 'Home',     href: '/',        icon: Home },
    { label: 'Shop',     href: '/products', icon: ShoppingBag },
    { label: 'Deals',    href: '/deals',    icon: Tag },
    { label: 'About',    href: '/about',    icon: Info },
  ]

  return (
    <div className="min-h-screen bg-warm-gradient flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center space-y-10">
          {/* Visual */}
          <div className="relative inline-block">
            <div className="font-display text-[12rem] font-bold leading-none select-none" style={{
              background: 'linear-gradient(135deg, hsl(30 10% 90%), hsl(30 10% 80%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl animate-float">🔍</div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3 opacity-0 animate-fade-in-up">
            <h1 className="font-display text-3xl font-bold text-foreground">Page not found</h1>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center opacity-0 animate-fade-in-up delay-200">
            <Link href="/" className="btn-primary px-8 py-3.5 justify-center">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products" className="btn-outline px-8 py-3.5 justify-center">
              Browse Products
            </Link>
          </div>

          {/* Quick links */}
          <div className="opacity-0 animate-fade-in-up delay-300">
            <p className="text-sm text-muted-foreground mb-4">Or jump to:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-accent hover:border-accent/30 transition-all"
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center space-y-8 py-20">
          {/* Big 404 Text */}
          <div className="space-y-4">
            <div className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </div>
            <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oops! The page you{"'"}re looking for doesn{"'"}t exist. It might have been moved or deleted.
            </p>
          </div>

          {/* Illustration */}
          <div className="inline-block text-9xl">🔍</div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="rounded-lg bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Home
            </Link>
            <Link
              href="/products"
              className="rounded-lg border-2 border-accent text-accent px-8 py-3 font-semibold hover:bg-accent/10 transition-colors"
            >
              Browse Products
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="space-y-4 pt-8 border-t border-border/50">
            <p className="text-muted-foreground">Here are some helpful links:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/products' },
                { label: 'Deals', href: '/deals' },
                { label: 'About', href: '/about' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-accent hover:underline"
                >
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

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
              <span className="font-bold text-lg">PrimeStore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium shopping experience with curated products and exceptional service.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Electronics</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Fashion</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Home & Garden</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Sports</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Press</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:support@primestore.com" className="text-muted-foreground hover:text-foreground transition">
                  support@primestore.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span className="text-muted-foreground">123 Commerce St, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 PrimeStore. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

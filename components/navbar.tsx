'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useAppState } from './app-state-provider'

export function Navbar() {
  const { isAuthenticated, logout, cartCount } = useAppState();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">PrimeStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            <DropdownLink label="Shop" href="/products" items={['Electronics', 'Fashion', 'Home']} />
            {isAuthenticated ? (
              <Link href="/orders" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
                Orders
              </Link>
            ) : null}
            <Link href="/deals" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
              Deals
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            {isSearchOpen ? (
              <div className="relative hidden w-64 sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Icons */}
            <button className="rounded-lg p-2 hover:bg-muted" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button>

            <Link href="/cart" className="relative rounded-lg p-2 hover:bg-muted" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>

            {/* Auth Links */}
{isAuthenticated ? (
  <button
    onClick={logout}
    className="text-sm font-medium hover:text-foreground"
  >
    Logout
  </button>
) : (
  <>
    <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-foreground">
      Login
    </Link>
    <Link href="/register" className="hidden sm:block text-sm font-medium hover:text-foreground">
      Register
    </Link>
  </>
)}

<ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 lg:hidden hover:bg-muted"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border/50 py-4 lg:hidden">
            <Link href="/products" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
              Shop
            </Link>
            {isAuthenticated ? (
              <Link href="/orders" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
                Orders
              </Link>
            ) : null}
            <Link href="/deals" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
              Deals
            </Link>
            <Link href="/about" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
              About
            </Link>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-muted rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
                  Login
                </Link>

                <Link href="/register" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

function DropdownLink({ label, href, items }: { label: string; href: string; items?: string[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <button className="inline-flex items-center space-x-1 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>

      {items && (
        <div className="absolute left-0 mt-0 hidden w-48 rounded-lg border border-border bg-card shadow-elevation opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
          {items.map((item) => (
            <Link
              key={item}
              href={`${href}/${item.toLowerCase()}`}
              className="block px-4 py-3 text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

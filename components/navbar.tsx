'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Heart, Search, ShoppingCart, Menu, X, ChevronDown, Zap, Sparkles, User, LogOut, Package, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useAppState } from './app-state-provider'

const SHOP_ITEMS = [
  { name: 'Electronics', href: '/products/electronics', icon: '💻', desc: '2,840+ items' },
  { name: 'Fashion', href: '/products/fashion', icon: '👗', desc: '5,120+ items' },
  { name: 'Home & Garden', href: '/products/home', icon: '🏡', desc: '3,450+ items' },
]

export function Navbar() {
  const { isAuthenticated, logout, cartCount, wishlistCount } = useAppState()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (y / docH) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setIsMenuOpen(false) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] transition-all duration-150"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, hsl(258 90% 66%), hsl(327 80% 62%), hsl(186 90% 50%))',
        }}
      />

      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(258_90%_66%)] to-[hsl(327_80%_62%)] animate-pulse-glow" />
                <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(258_90%_66%)] to-[hsl(327_80%_62%)] flex items-center justify-center shadow-[0_0_20px_hsl(258_90%_66%/0.4)]">
                  <Zap className="h-5 w-5 text-white fill-white" />
                </div>
              </div>
              <span className="hidden sm:block font-display text-xl font-bold">
                <span className="gradient-text">Prime</span>
                <span className="text-foreground/90">Store</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              <ShopDropdown />
              {isAuthenticated && <NavLink href="/orders" label="Orders" />}
              <NavLink href="/deals" label="Deals" highlight />
              <NavLink href="/about" label="About" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-56 sm:w-72 rounded-xl border border-[hsl(258_90%_66%/0.25)] bg-[hsl(224_18%_10%/0.9)] pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(258_90%_66%/0.5)] focus:shadow-[0_0_0_3px_hsl(258_90%_66%/0.1)] transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex h-5 items-center rounded border border-white/10 bg-white/5 px-1.5 text-[10px] text-muted-foreground font-mono">ESC</kbd>
                  </div>
                  <button onClick={() => setIsSearchOpen(false)} className="rounded-lg p-2 hover:bg-white/5 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:border-[hsl(258_90%_66%/0.3)] hover:text-foreground transition-all duration-200"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden md:block">Search</span>
                    <kbd className="hidden lg:flex h-5 items-center rounded border border-white/10 bg-white/5 px-1.5 text-[10px] font-mono">⌘K</kbd>
                  </button>
                  <button onClick={() => setIsSearchOpen(true)} className="sm:hidden rounded-lg p-2 hover:bg-white/5 transition-colors" aria-label="Search">
                    <Search className="h-5 w-5" />
                  </button>
                </>
              )}

              <Link href="/wishlist" className="relative rounded-xl p-2.5 hover:bg-white/5 transition-colors group" aria-label="Wishlist">
                <Heart className="h-5 w-5 group-hover:text-[hsl(327_80%_62%)] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(327_80%_62%)] to-[hsl(350_85%_65%)] px-0.5 text-[10px] font-bold text-white shadow-[0_0_10px_hsl(327_80%_62%/0.5)]">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative rounded-xl p-2.5 hover:bg-white/5 transition-colors group" aria-label="Cart">
                <ShoppingCart className="h-5 w-5 group-hover:text-[hsl(258_90%_66%)] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(258_90%_66%)] to-[hsl(280_85%_65%)] px-0.5 text-[10px] font-bold text-white shadow-[0_0_10px_hsl(258_90%_66%/0.5)]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-[hsl(258_90%_66%/0.3)] transition-all">
                    <User className="h-4 w-4" />
                    <span className="hidden md:block">Account</span>
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-52 rounded-2xl border border-white/10 bg-[hsl(224_18%_8%)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2">
                      <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-[hsl(258_90%_66%)]" /> Dashboard
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5 transition-colors">
                        <Package className="h-4 w-4 text-[hsl(186_90%_50%)]" /> My Orders
                      </Link>
                      <div className="my-1 h-px bg-white/5" />
                      <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4 rounded-xl">
                    Get Started
                  </Link>
                </div>
              )}

              <ThemeToggle />

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden rounded-xl p-2.5 hover:bg-white/5 transition-colors">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden glass border-t border-white/5 animate-fade-in-down">
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              <MobileLink href="/products" onClick={() => setIsMenuOpen(false)}>Shop All</MobileLink>
              <MobileLink href="/products/electronics" onClick={() => setIsMenuOpen(false)}>💻 Electronics</MobileLink>
              <MobileLink href="/products/fashion" onClick={() => setIsMenuOpen(false)}>👗 Fashion</MobileLink>
              <MobileLink href="/deals" onClick={() => setIsMenuOpen(false)}>🔥 Deals</MobileLink>
              {isAuthenticated && <MobileLink href="/orders" onClick={() => setIsMenuOpen(false)}>📦 Orders</MobileLink>}
              <MobileLink href="/about" onClick={() => setIsMenuOpen(false)}>About</MobileLink>
              <div className="pt-2 border-t border-white/5">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsMenuOpen(false) }} className="w-full text-left px-4 py-3 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors">
                    Sign Out
                  </button>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors">Sign In</Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 btn-primary text-sm py-2.5 rounded-xl text-center">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

function NavLink({ href, label, highlight }: { href: string; label: string; highlight?: boolean }) {
  return (
    <Link href={href} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${highlight ? 'text-[hsl(327_80%_65%)] hover:bg-[hsl(327_80%_62%/0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
      {highlight && <span className="mr-1">🔥</span>}{label}
    </Link>
  )
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground rounded-xl hover:bg-white/5 hover:text-foreground transition-colors">{children}</Link>
  )
}

function ShopDropdown() {
  return (
    <div className="relative group">
      <Link href="/products" className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl hover:text-foreground hover:bg-white/5 transition-all duration-200">
        Shop <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </Link>
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <div className="w-72 rounded-2xl border border-white/10 bg-[hsl(224_18%_7%)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-3">
          <div className="mb-2 px-2 pb-2 border-b border-white/5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Categories</p>
          </div>
          {SHOP_ITEMS.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition-colors group/item">
              <span className="text-2xl group-hover/item:scale-110 transition-transform">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-white/5">
            <Link href="/products" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(258_90%_66%/0.1)] to-[hsl(327_80%_62%/0.1)] border border-[hsl(258_90%_66%/0.2)] py-2.5 text-sm font-medium text-[hsl(258_90%_70%)] hover:from-[hsl(258_90%_66%/0.2)] hover:to-[hsl(327_80%_62%/0.2)] transition-all">
              <Sparkles className="h-4 w-4" /> View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

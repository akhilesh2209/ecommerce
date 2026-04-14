'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  ChevronRight, Lock, ShoppingCart, CheckCircle2,
  MapPin, CreditCard, ClipboardCheck, PartyPopper,
  Shield, Truck, Package, Star, ArrowLeft, Zap,
  Eye, EyeOff, Wifi, ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import API from "@/lib/api"
import { toast } from "sonner"
import { useAppState } from "@/components/app-state-provider"

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation'

const STEPS: { id: CheckoutStep; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'shipping', label: 'Shipping', icon: MapPin, desc: 'Delivery address' },
  { id: 'payment', label: 'Payment', icon: CreditCard, desc: 'Card details' },
  { id: 'review', label: 'Review', icon: ClipboardCheck, desc: 'Confirm order' },
  { id: 'confirmation', label: 'Done', icon: CheckCircle2, desc: 'Order placed' },
]

/* ─── Live Credit Card Component ─────────────────────────────── */
function CreditCardPreview({
  cardNumber, cardName, expiry, cvv, isFlipped
}: {
  cardNumber: string; cardName: string; expiry: string; cvv: string; isFlipped: boolean
}) {
  const formatted = cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() || '•••• •••• •••• ••••'
  const displayName = cardName || 'FULL NAME'

  const getCardType = (num: string) => {
    const n = num.replace(/\s/g, '')
    if (n.startsWith('4')) return 'visa'
    if (/^5[1-5]/.test(n)) return 'mastercard'
    if (n.startsWith('3')) return 'amex'
    return 'generic'
  }
  const cardType = getCardType(cardNumber)

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ height: '200px', perspective: '1200px' }}>
      <div
        className="relative w-full h-full transition-all duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Card gradient */}
          <div className="absolute inset-0" style={{
            background: cardType === 'visa'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)'
              : cardType === 'mastercard'
              ? 'linear-gradient(135deg, #1a0a00 0%, #3d0000 50%, #1a0a00 100%)'
              : cardType === 'amex'
              ? 'linear-gradient(135deg, #003d6b 0%, #006494 50%, #003d6b 100%)'
              : 'linear-gradient(135deg, hsl(258 80% 12%) 0%, hsl(270 60% 18%) 50%, hsl(285 70% 14%) 100%)',
          }} />

          {/* Noise texture */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          }} />

          {/* Holographic shimmer */}
          <div className="absolute inset-0 opacity-20" style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            animation: 'card-shimmer 3s ease-in-out infinite',
          }} />

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* Circles deco */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              {/* Chip */}
              <div className="w-10 h-8 rounded-md" style={{
                background: 'linear-gradient(135deg, #d4a843 0%, #f0c060 40%, #a07830 60%, #d4a843 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
              }}>
                <div className="w-full h-full rounded-md opacity-60" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }} />
              </div>
              {/* Card network logo */}
              <div className="text-white opacity-80">
                {cardType === 'visa' && (
                  <span className="font-bold text-xl italic tracking-wider" style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>VISA</span>
                )}
                {cardType === 'mastercard' && (
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full opacity-90" style={{ background: '#eb001b' }} />
                    <div className="w-7 h-7 rounded-full -ml-3 opacity-70" style={{ background: '#f79e1b' }} />
                  </div>
                )}
                {cardType === 'amex' && (
                  <span className="font-bold text-sm tracking-widest">AMEX</span>
                )}
                {cardType === 'generic' && (
                  <Wifi className="w-5 h-5 rotate-90 opacity-60" />
                )}
              </div>
            </div>

            {/* Card number */}
            <div>
              <p className="font-mono text-white text-lg tracking-widest"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)', letterSpacing: '0.2em' }}>
                {formatted.padEnd(19, '•').slice(0, 19)}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-1">Card Holder</p>
                <p className="text-white font-medium text-sm uppercase tracking-wider truncate max-w-[140px]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {displayName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-1">Expires</p>
                <p className="text-white font-medium text-sm font-mono">{expiry || '••/••'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, hsl(258 80% 10%) 0%, hsl(270 60% 16%) 100%)',
          }} />
          {/* Magnetic stripe */}
          <div className="absolute top-8 left-0 right-0 h-10" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)' }} />
          {/* Signature strip */}
          <div className="absolute top-[88px] left-6 right-16 h-8 rounded-sm flex items-center px-3" style={{
            background: 'linear-gradient(90deg, #f0f0f0, #fff)',
            backgroundImage: 'repeating-linear-gradient(45deg, #e8e8e8 0, #e8e8e8 1px, transparent 0, transparent 50%)',
            backgroundSize: '4px 4px',
          }}>
            <span className="text-gray-800 font-mono text-xs italic opacity-60">{cardName}</span>
          </div>
          {/* CVV box */}
          <div className="absolute top-[88px] right-6 h-8 w-12 bg-white rounded-sm flex items-center justify-center">
            <span className="font-mono text-sm text-gray-800 font-bold">{cvv || '•••'}</span>
          </div>
          {/* Bottom info */}
          <div className="absolute bottom-5 left-6 right-6">
            <p className="text-white/30 text-[9px] leading-relaxed">
              This card is property of PrimeStore Financial. Use of this card is subject to the cardholder agreement.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes card-shimmer {
          0%, 100% { transform: translateX(-100%) skewX(-15deg); }
          50% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
    </div>
  )
}

/* ─── Step Progress ────────────────────────────────────────────── */
function StepProgress({ step, currentStepIdx }: { step: CheckoutStep; currentStepIdx: number }) {
  return (
    <div className="relative mb-12">
      {/* Background track */}
      <div className="absolute top-5 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.08), rgba(255,255,255,0.05))' }} />

      {/* Animated progress fill */}
      <div
        className="absolute top-5 left-0 h-px transition-all duration-700 ease-out"
        style={{
          width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%`,
          background: 'linear-gradient(90deg, hsl(258 90% 66%), hsl(327 80% 62%))',
          boxShadow: '0 0 8px hsl(258 90% 66% / 0.6)',
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        {STEPS.map((s, index) => {
          const isPast = currentStepIdx > index
          const isCurrent = currentStepIdx === index
          const Icon = s.icon
          return (
            <div key={s.id} className="flex flex-col items-center gap-2.5" style={{ minWidth: 0 }}>
              {/* Circle */}
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-500 border
                ${isPast
                  ? 'border-transparent'
                  : isCurrent
                  ? 'border-transparent'
                  : 'border-white/10 bg-white/3'
                }
              `} style={
                isPast ? {
                  background: 'linear-gradient(135deg, hsl(258 90% 66%), hsl(327 80% 62%))',
                  boxShadow: '0 0 16px hsl(258 90% 66% / 0.5)',
                } : isCurrent ? {
                  background: 'linear-gradient(135deg, hsl(258 90% 20%), hsl(258 90% 15%))',
                  boxShadow: '0 0 0 3px hsl(258 90% 66% / 0.25), 0 0 20px hsl(258 90% 66% / 0.3)',
                  borderColor: 'hsl(258 90% 66% / 0.6)',
                } : {}
              }>
                {isPast ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-violet-400' : 'text-white/25'}`} />
                )}

                {/* Pulse ring for current */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: 'hsl(258 90% 66% / 0.3)' }} />
                )}
              </div>

              {/* Labels */}
              <div className="text-center hidden sm:block">
                <p className={`text-xs font-semibold transition-colors ${
                  isCurrent ? 'text-violet-400' : isPast ? 'text-white/60' : 'text-white/20'
                }`}>{s.label}</p>
                <p className={`text-[10px] mt-0.5 transition-colors ${
                  isCurrent ? 'text-white/40' : 'text-white/15'
                }`}>{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Trust Badge ────────────────────────────────────────────────── */
function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {[
        { icon: Shield, label: '256-bit SSL', sub: 'Bank-grade' },
        { icon: Lock, label: 'PCI DSS', sub: 'Compliant' },
        { icon: Zap, label: 'Instant', sub: 'Processing' },
      ].map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Icon className="w-4 h-4 text-violet-400" />
          <p className="text-[11px] font-semibold text-white/60">{label}</p>
          <p className="text-[9px] text-white/25">{sub}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Order Summary Sidebar ─────────────────────────────────────── */
function OrderSummary({
  cartItems, isCartLoading, cartSubtotal, cartTax, cartShipping, cartTotal, itemCount
}: {
  cartItems: any[], isCartLoading: boolean, cartSubtotal: number,
  cartTax: number, cartShipping: number, cartTotal: number, itemCount: number
}) {
  return (
    <div className="sticky top-24 space-y-0 overflow-hidden rounded-2xl"
      style={{
        background: 'hsl(224 18% 7%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>

      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.2), hsl(327 80% 62% / 0.1))' }}>
            <ShoppingCart className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h3 className="font-semibold text-white/90 text-sm">Order Summary</h3>
          {itemCount > 0 && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-violet-300"
              style={{ background: 'hsl(258 90% 66% / 0.15)', border: '1px solid hsl(258 90% 66% / 0.25)' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="p-5 max-h-52 overflow-y-auto space-y-3" style={{ scrollbarWidth: 'none' }}>
        {isCartLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 rounded animate-pulse w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-2 rounded animate-pulse w-1/2" style={{ background: 'rgba(255,255,255,0.03)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <p className="text-sm text-white/25 text-center py-4">Cart is empty</p>
        ) : (
          cartItems.map((it) => (
            <div key={it._id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {it?.product?.image?.startsWith('http') ? (
                  <img src={it.product.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/70 truncate">{it?.product?.name}</p>
                <p className="text-[10px] text-white/30">Qty: {it?.quantity}</p>
              </div>
              <p className="text-xs font-bold text-white/60 flex-shrink-0">
                ${(it?.product?.price * it?.quantity).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pricing */}
      <div className="p-5 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {[
          { label: 'Subtotal', val: `$${cartSubtotal.toFixed(2)}`, highlight: false },
          { label: 'Shipping', val: cartShipping === 0 ? 'Free 🎉' : `$${cartShipping.toFixed(2)}`, highlight: cartShipping === 0, green: true },
          { label: 'Tax (8%)', val: `$${cartTax.toFixed(2)}`, highlight: false },
        ].map(({ label, val, highlight, green }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-xs text-white/35">{label}</span>
            <span className={`text-xs font-medium ${green && cartShipping === 0 ? 'text-emerald-400' : 'text-white/55'}`}>{val}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="p-5 border-t" style={{
        borderColor: 'rgba(255,255,255,0.05)',
        background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.06), hsl(327 80% 62% / 0.04))',
      }}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white/80">Total</span>
          <div className="text-right">
            <p className="text-xl font-bold" style={{
              background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>${cartTotal.toFixed(2)}</p>
            <p className="text-[10px] text-white/25 mt-0.5">USD incl. all taxes</p>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <p className="text-[10px] text-white/30 leading-relaxed">
            Secured by 256-bit SSL encryption. Your payment data is never stored on our servers.
          </p>
        </div>

        {/* Accepted cards */}
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[10px] text-white/20">Accepted:</p>
          <div className="flex gap-1.5">
            {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(c => (
              <span key={c} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const { userId, isAuthenticated, setCartCountFromItems, refreshCartCount } = useAppState()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [showCvv, setShowCvv] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Format card number
    if (name === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16)
      const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }

    // Format expiry
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
      setFormData(prev => ({ ...prev, [name]: formatted }))
      return
    }

    // CVV — digits only
    if (name === 'cvv') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      setFormData(prev => ({ ...prev, [name]: digits }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return
      try {
        const res = await API.get(`/cart/${userId}`)
        setCartItems(res.data || [])
      } catch {
        toast.error("Failed to load cart")
        setCartItems([])
      } finally {
        setIsCartLoading(false)
      }
    }
    fetchCart()
  }, [userId])

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item?.product?.price * item?.quantity, 0)
  const cartTax = cartSubtotal * 0.08
  const cartShipping = cartSubtotal > 100 ? 0 : 15
  const cartTotal = cartSubtotal + cartTax + cartShipping
  const itemCount = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0)

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    try {
      if (!isAuthenticated) { toast.error("Please login first"); setIsPlacingOrder(false); return }
      if (cartItems.length === 0) { toast.error("Cart is empty"); return }
      const res = await API.post("/orders", {})
      setOrder(res.data)
      setCartItems([])
      setCartCountFromItems([])
      refreshCartCount()
      setConfetti(true)
      toast.success("Order placed! 🎉")
      setStep("confirmation")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to place order")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const currentStepIdx = STEPS.findIndex(s => s.id === step)

  /* shared input style */
  const inp = `
    w-full px-4 py-3.5 rounded-xl text-sm text-white/85 outline-none transition-all duration-200
    placeholder:text-white/20 font-medium
  `
  const inpStyle = {
    background: 'hsl(224 20% 9%)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  const inpFocusClass = 'focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50'

  return (
    <div className="min-h-screen" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.06]"
          style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'hsl(327 80% 62%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-violet-400/80">Secure Checkout</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Complete Your Order
            </h1>
          </div>
          <Link href="/cart"
            className="flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to cart
          </Link>
        </div>

        {/* Step progress */}
        <StepProgress step={step} currentStepIdx={currentStepIdx} />

        <div className="grid gap-8 lg:grid-cols-5">

          {/* ── Main Form Area (3/5) ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* ── SHIPPING ── */}
            {step === 'shipping' && (
              <div key="shipping" className="space-y-5"
                style={{ animation: 'slideUp 0.4s cubic-bezier(0.23,1,0.32,1)' }}>
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>

                  {/* Section header */}
                  <div className="px-6 py-5 border-b flex items-center gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.2), hsl(327 80% 62% / 0.1))' }}>
                      <MapPin className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Delivery Address</h2>
                      <p className="text-xs text-white/30">Where should we send your order?</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'hsl(258 90% 66% / 0.1)',
                        color: 'hsl(258 90% 72%)',
                        border: '1px solid hsl(258 90% 66% / 0.2)',
                      }}>Step 1 of 3</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">First Name</label>
                        <input type="text" name="firstName" placeholder="Jane" value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Last Name</label>
                        <input type="text" name="lastName" placeholder="Doe" value={formData.lastName}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Email</label>
                        <input type="email" name="email" placeholder="jane@example.com" value={formData.email}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Phone</label>
                        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Street Address</label>
                      <input type="text" name="address" placeholder="123 Main Street, Apt 4B" value={formData.address}
                        onChange={handleInputChange}
                        className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">City</label>
                        <input type="text" name="city" placeholder="New York" value={formData.city}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">State</label>
                        <input type="text" name="state" placeholder="NY" value={formData.state}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">ZIP</label>
                        <input type="text" name="zipCode" placeholder="10001" value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Country</label>
                      <select name="country" value={formData.country} onChange={handleInputChange}
                        className={`${inp} ${inpFocusClass} cursor-pointer`} style={{ ...inpStyle, color: formData.country ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)' }}>
                        <option value="">Select your country</option>
                        <option value="US">🇺🇸 United States</option>
                        <option value="CA">🇨🇦 Canada</option>
                        <option value="UK">🇬🇧 United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery options */}
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-6 py-5 border-b flex items-center gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <Truck className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-bold text-white">Delivery Method</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Shipping', sub: '5–7 business days', price: cartSubtotal > 100 ? 'Free' : '$15.00', recommended: false },
                      { id: 'express', label: 'Express Shipping', sub: '2–3 business days', price: '$9.99', recommended: false },
                      { id: 'overnight', label: 'Overnight Delivery', sub: 'Next business day', price: '$24.99', recommended: true },
                    ].map((opt, i) => (
                      <label key={opt.id}
                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all group"
                        style={{
                          background: i === 0 ? 'hsl(258 90% 66% / 0.06)' : 'rgba(255,255,255,0.02)',
                          border: i === 0 ? '1px solid hsl(258 90% 66% / 0.25)' : '1px solid rgba(255,255,255,0.04)',
                        }}>
                        <input type="radio" name="delivery" defaultChecked={i === 0}
                          className="accent-violet-500" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white/80">{opt.label}</p>
                            {opt.recommended && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-violet-300"
                                style={{ background: 'hsl(258 90% 66% / 0.15)', border: '1px solid hsl(258 90% 66% / 0.25)' }}>
                                FASTEST
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/30 mt-0.5">{opt.sub}</p>
                        </div>
                        <p className={`text-sm font-bold ${opt.price === 'Free' ? 'text-emerald-400' : 'text-white/60'}`}>
                          {opt.price}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep('payment')}
                  className="w-full py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(280 85% 60%))',
                    boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)')}>
                  Continue to Payment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ── PAYMENT ── */}
            {step === 'payment' && (
              <div key="payment" className="space-y-5"
                style={{ animation: 'slideUp 0.4s cubic-bezier(0.23,1,0.32,1)' }}>

                {/* Live card preview */}
                <CreditCardPreview
                  cardNumber={formData.cardNumber}
                  cardName={formData.cardName}
                  expiry={formData.expiry}
                  cvv={formData.cvv}
                  isFlipped={cardFlipped}
                />

                {/* Payment form */}
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>

                  <div className="px-6 py-5 border-b flex items-center gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, hsl(327 80% 62% / 0.2), hsl(258 90% 66% / 0.1))' }}>
                      <CreditCard className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Payment Details</h2>
                      <p className="text-xs text-white/30">Your card info is encrypted end-to-end</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'hsl(327 80% 62% / 0.1)',
                        color: 'hsl(327 80% 70%)',
                        border: '1px solid hsl(327 80% 62% / 0.2)',
                      }}>Step 2 of 3</span>
                  </div>

                  {/* Payment method tabs */}
                  <div className="px-6 pt-5">
                    <div className="flex gap-2">
                      {[
                        { label: '💳 Card', active: true },
                        { label: '🏦 Bank', active: false },
                        { label: '📱 UPI', active: false },
                      ].map(({ label, active }) => (
                        <button key={label}
                          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: active ? 'hsl(258 90% 66% / 0.15)' : 'rgba(255,255,255,0.03)',
                            border: active ? '1px solid hsl(258 90% 66% / 0.3)' : '1px solid rgba(255,255,255,0.06)',
                            color: active ? 'hsl(258 90% 72%)' : 'rgba(255,255,255,0.3)',
                          }}
                          onClick={() => active ? null : toast.info('Coming soon!')}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Cardholder Name</label>
                      <input type="text" name="cardName" placeholder="Jane Doe" value={formData.cardName}
                        onChange={handleInputChange}
                        className={`${inp} ${inpFocusClass}`} style={inpStyle} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Card Number</label>
                      <div className="relative">
                        <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass} font-mono tracking-widest pr-12`}
                          style={inpStyle} maxLength={19} />
                        {/* Card type indicator */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-60">
                          {formData.cardNumber.startsWith('4') ? '💙' : formData.cardNumber.startsWith('5') ? '🔴' : formData.cardNumber.startsWith('3') ? '💚' : '💳'}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Expiry Date</label>
                        <input type="text" name="expiry" placeholder="MM / YY" value={formData.expiry}
                          onChange={handleInputChange}
                          className={`${inp} ${inpFocusClass} font-mono tracking-widest`}
                          style={inpStyle} maxLength={5} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/35">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? 'text' : 'password'}
                            name="cvv"
                            placeholder="•••"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            onFocus={() => setCardFlipped(true)}
                            onBlur={() => setCardFlipped(false)}
                            className={`${inp} ${inpFocusClass} font-mono tracking-widest pr-12`}
                            style={inpStyle} maxLength={4} />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-white/20">3–4 digits on back of card</p>
                      </div>
                    </div>

                    {/* Save card toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <div>
                          <p className="text-xs font-semibold text-white/60">Save this card</p>
                          <p className="text-[10px] text-white/25">Encrypted & secure for future checkouts</p>
                        </div>
                      </div>
                      <div className="w-9 h-5 rounded-full relative cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, hsl(258 90% 66%), hsl(327 80% 62%))' }}>
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>

                    {/* SSL badge */}
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <p className="text-[11px] text-emerald-400/70">
                        Protected by 256-bit AES encryption • PCI DSS Level 1 Compliant
                      </p>
                    </div>
                  </div>
                </div>

                <TrustBadges />

                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')}
                    className="flex-1 py-4 rounded-xl text-sm font-semibold text-white/50 flex items-center justify-center gap-2 transition-all hover:text-white/80"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep('review')}
                    className="flex-[3] py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))',
                      boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                    Review Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── REVIEW ── */}
            {step === 'review' && (
              <div key="review" className="space-y-5"
                style={{ animation: 'slideUp 0.4s cubic-bezier(0.23,1,0.32,1)' }}>

                {/* Review card */}
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}>

                  <div className="px-6 py-5 border-b flex items-center gap-3"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, hsl(150 100% 45% / 0.2), hsl(150 100% 45% / 0.05))' }}>
                      <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Review Your Order</h2>
                      <p className="text-xs text-white/30">Double-check everything before placing</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'hsl(150 100% 45% / 0.1)',
                        color: 'hsl(150 100% 55%)',
                        border: '1px solid hsl(150 100% 45% / 0.2)',
                      }}>Final Step</span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Shipping review */}
                    <div className="p-4 rounded-xl space-y-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Shipping To</span>
                        </div>
                        <button onClick={() => setStep('shipping')}
                          className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-white/70 pl-5 leading-relaxed">
                        {[formData.firstName, formData.lastName].filter(Boolean).join(' ') || '—'}
                        {formData.address && <><br />{formData.address}</>}
                        {(formData.city || formData.state) && <><br />{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</>}
                        {formData.country && <><br />{formData.country}</>}
                      </p>
                    </div>

                    {/* Payment review */}
                    <div className="p-4 rounded-xl space-y-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Payment</span>
                        </div>
                        <button onClick={() => setStep('payment')}
                          className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center gap-3 pl-5">
                        <div className="w-10 h-7 rounded-md flex items-center justify-center text-xs"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          💳
                        </div>
                        <p className="text-sm text-white/70">
                          {formData.cardNumber
                            ? `•••• •••• •••• ${formData.cardNumber.replace(/\s/g, '').slice(-4)}`
                            : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Items mini list */}
                    {cartItems.length > 0 && (
                      <div className="p-4 rounded-xl space-y-2.5"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Items</span>
                        </div>
                        {cartItems.map(it => (
                          <div key={it._id} className="flex justify-between items-center pl-5">
                            <span className="text-xs text-white/50 truncate max-w-[200px]">
                              {it?.product?.name} × {it?.quantity}
                            </span>
                            <span className="text-xs font-semibold text-white/50">
                              ${(it?.product?.price * it?.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Place order CTA */}
                <div className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(150 60% 8%), hsl(150 50% 10%))',
                    border: '1px solid hsl(150 100% 45% / 0.2)',
                  }}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/50 leading-relaxed">
                        By placing your order you agree to PrimeStore's Terms of Service. Your payment is secured and you can cancel within 24 hours.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep('payment')}
                        className="flex-none py-4 px-6 rounded-xl text-sm font-semibold text-white/40 flex items-center justify-center gap-2 transition-all hover:text-white/70"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder || isCartLoading || cartItems.length === 0}
                        className="flex-1 py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: isPlacingOrder || isCartLoading || cartItems.length === 0
                            ? 'rgba(255,255,255,0.08)'
                            : 'linear-gradient(135deg, hsl(150 80% 35%), hsl(150 70% 42%))',
                          boxShadow: isPlacingOrder || isCartLoading || cartItems.length === 0
                            ? 'none'
                            : '0 8px 32px hsl(150 100% 45% / 0.3)',
                        }}
                        onMouseEnter={e => { if (!isPlacingOrder) e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
                        {isPlacingOrder ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Placing Order…
                          </>
                        ) : isCartLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Loading…
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Place Order · ${cartTotal.toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── CONFIRMATION ── */}
            {step === 'confirmation' && (
              <div key="confirmation" className="space-y-6"
                style={{ animation: 'bounceIn 0.6s cubic-bezier(0.23,1,0.32,1)' }}>

                {/* Success card */}
                <div className="rounded-2xl overflow-hidden relative"
                  style={{
                    background: 'hsl(224 18% 7%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>

                  {/* Confetti particles */}
                  {confetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <div key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: '-10px',
                            background: ['hsl(258 90% 66%)', 'hsl(327 80% 62%)', 'hsl(186 90% 55%)', 'hsl(43 96% 56%)'][i % 4],
                            animation: `confetti-fall ${1 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
                          }} />
                      ))}
                    </div>
                  )}

                  <div className="p-10 text-center space-y-6">
                    {/* Success icon */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
                        style={{
                          background: 'linear-gradient(135deg, hsl(150 60% 10%), hsl(150 50% 14%))',
                          border: '1px solid hsl(150 100% 45% / 0.3)',
                          boxShadow: '0 0 40px hsl(150 100% 45% / 0.2)',
                        }}>
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" strokeWidth={1.5} />
                        {/* Ping rings */}
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                          style={{ background: 'hsl(150 100% 45% / 0.2)' }} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Order Confirmed! 🎉
                      </h2>
                      <p className="text-white/45 max-w-md mx-auto leading-relaxed text-sm">
                        Your order has been placed and is being processed. You'll receive a confirmation email shortly with tracking details.
                      </p>
                    </div>

                    {/* Order ID */}
                    <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full"
                      style={{
                        background: 'hsl(258 90% 66% / 0.1)',
                        border: '1px solid hsl(258 90% 66% / 0.25)',
                      }}>
                      <Package className="w-4 h-4 text-violet-400" />
                      <span className="font-mono text-sm font-bold text-violet-300">
                        #{order?._id ? order._id.toString().slice(-10).toUpperCase() : 'PROCESSING'}
                      </span>
                    </div>

                    {/* Progress stages */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      {[
                        { label: 'Confirmed', done: true },
                        { label: 'Processing', done: false, active: true },
                        { label: 'Shipped', done: false },
                        { label: 'Delivered', done: false },
                      ].map(({ label, done, active }, i) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                              done ? 'bg-emerald-400' : active ? 'bg-violet-400 animate-pulse' : 'bg-white/15'
                            }`} />
                            <p className={`text-[9px] font-medium ${done ? 'text-emerald-400' : active ? 'text-violet-400' : 'text-white/20'}`}>
                              {label}
                            </p>
                          </div>
                          {i < 3 && <div className="w-8 h-px mb-4" style={{ background: done ? 'hsl(150 100% 45% / 0.4)' : 'rgba(255,255,255,0.08)' }} />}
                        </div>
                      ))}
                    </div>

                    {/* Est. delivery */}
                    <div className="inline-flex items-center gap-2 text-xs text-white/30">
                      <Truck className="w-3.5 h-3.5" />
                      Estimated delivery: <span className="text-white/50 font-semibold">3–5 business days</span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <Link href="/"
                        className="px-8 py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
                        style={{
                          background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))',
                          boxShadow: '0 6px 24px hsl(258 90% 66% / 0.3)',
                        }}>
                        Continue Shopping
                      </Link>
                      <Link href="/orders"
                        className="px-8 py-3.5 rounded-xl font-semibold text-white/60 text-sm flex items-center justify-center gap-2 transition-all hover:text-white/80"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Package className="w-4 h-4" />
                        Track Orders
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Review prompt */}
                <div className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: 'hsl(224 18% 7%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/70">Enjoying PrimeStore?</p>
                    <p className="text-xs text-white/30">Share your experience and help others discover us</p>
                  </div>
                  <button className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    style={{ background: 'hsl(43 96% 56% / 0.12)', color: 'hsl(43 96% 65%)', border: '1px solid hsl(43 96% 56% / 0.2)' }}
                    onClick={() => toast.success('Thank you for your review! ⭐')}>
                    Rate Us
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary (2/5) ── */}
          <div className="lg:col-span-2">
            <OrderSummary
              cartItems={cartItems}
              isCartLoading={isCartLoading}
              cartSubtotal={cartSubtotal}
              cartTax={cartTax}
              cartShipping={cartShipping}
              cartTotal={cartTotal}
              itemCount={itemCount}
            />
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.85); }
          60% { transform: scale(1.03); }
          80% { transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ChevronRight, Lock, ShoppingCart, CheckCircle2, MapPin, CreditCard, ClipboardCheck, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API from "@/lib/api";
import { toast } from "sonner";
import { useAppState } from "@/components/app-state-provider";

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation'

const STEPS: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'shipping',     label: 'Shipping',     icon: MapPin },
  { id: 'payment',      label: 'Payment',      icon: CreditCard },
  { id: 'review',       label: 'Review',       icon: ClipboardCheck },
  { id: 'confirmation', label: 'Confirm',      icon: CheckCircle2 },
]

export default function CheckoutPage() {
  const { userId, isAuthenticated, setCartCountFromItems, refreshCartCount } = useAppState();
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await API.get(`/cart/${userId}`);
        setCartItems(res.data || []);
      } catch (error) {
        toast.error("Failed to load cart");
        setCartItems([]);
      } finally {
        setIsCartLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item?.product?.price * item?.quantity, 0);
  const cartTax = cartSubtotal * 0.08;
  const cartShipping = cartSubtotal > 100 ? 0 : 15;
  const cartTotal = cartSubtotal + cartTax + cartShipping;
  const itemCount = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      if (!isAuthenticated) { toast.error("Please login first"); setIsPlacingOrder(false); return; }
      if (cartItems.length === 0) { toast.error("Cart is empty"); return; }
      const res = await API.post("/orders", {});
      setOrder(res.data);
      setCartItems([]);
      setCartCountFromItems([]);
      refreshCartCount();
      toast.success("Order placed successfully! 🎉");
      setStep("confirmation");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const currentStepIdx = STEPS.findIndex(s => s.id === step);

  const inputClass = "w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm";

  return (
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STEPS.map((s, index) => {
              const isPast = currentStepIdx > index;
              const isCurrent = step === s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <button
                    onClick={() => currentStepIdx >= index && setStep(s.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isPast
                        ? 'bg-accent border-accent text-white'
                        : isCurrent
                        ? 'bg-card border-accent text-accent animate-pulse-glow'
                        : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </button>
                  <span className={`hidden sm:block text-xs font-medium transition-colors ${isCurrent ? 'text-accent' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="card-luxury p-8 space-y-6 opacity-0 animate-scale-in">
                <div>
                  <p className="section-label mb-1">Step 1 of 3</p>
                  <h2 className="font-display text-2xl font-bold text-foreground">Shipping Address</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">First name</label>
                    <input type="text" name="firstName" placeholder="Jane" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Last name</label>
                    <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Email address</label>
                  <input type="email" name="email" placeholder="jane@example.com" value={formData.email} onChange={handleInputChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Phone number</label>
                  <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Street address</label>
                  <input type="text" name="address" placeholder="123 Main Street, Apt 4B" value={formData.address} onChange={handleInputChange} className={inputClass} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">City</label>
                    <input type="text" name="city" placeholder="New York" value={formData.city} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">State</label>
                    <input type="text" name="state" placeholder="NY" value={formData.state} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">ZIP / Postal code</label>
                    <input type="text" name="zipCode" placeholder="10001" value={formData.zipCode} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} className={inputClass}>
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => setStep('payment')} className="btn-primary w-full py-4 text-base justify-center">
                  Continue to Payment <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="card-luxury p-8 space-y-6 opacity-0 animate-scale-in">
                <div>
                  <p className="section-label mb-1">Step 2 of 3</p>
                  <h2 className="font-display text-2xl font-bold text-foreground">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-accent bg-accent/5 cursor-pointer">
                    <input type="radio" name="paymentMethod" defaultChecked className="accent-accent" />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent" />
                      <span className="font-medium text-foreground">Credit / Debit Card</span>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {["💳", "🏦"].map(e => <span key={e} className="text-lg">{e}</span>)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Cardholder name</label>
                    <input type="text" name="cardName" placeholder="Jane Doe" value={formData.cardName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Card number</label>
                    <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} className={`${inputClass} font-mono-custom tracking-widest`} maxLength={19} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Expiry date</label>
                      <input type="text" name="expiry" placeholder="MM / YY" value={formData.expiry} onChange={handleInputChange} className={`${inputClass} font-mono-custom`} maxLength={7} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">CVV</label>
                      <input type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} className={`${inputClass} font-mono-custom`} maxLength={4} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
                    <Lock className="w-3.5 h-3.5 text-green-500" />
                    Your payment information is encrypted with 256-bit SSL security
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="btn-outline flex-1 py-3.5 justify-center">
                    Back
                  </button>
                  <button onClick={() => setStep('review')} className="btn-primary flex-1 py-3.5 justify-center">
                    Review Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-4 opacity-0 animate-scale-in">
                <div className="card-luxury p-6">
                  <p className="section-label mb-3">Step 3 of 3</p>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Review Your Order</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MapPin className="w-4 h-4 text-accent" /> Shipping to
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {formData.firstName} {formData.lastName} · {formData.address}{formData.city ? `, ${formData.city}` : ''}{formData.state ? `, ${formData.state}` : ''} {formData.zipCode}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Lock className="w-4 h-4 text-green-500" /> Payment method
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        Card ending in •••• {formData.cardNumber.slice(-4) || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="btn-outline flex-1 py-3.5 justify-center">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || isCartLoading || cartItems.length === 0}
                    className={`flex-1 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                      isPlacingOrder || isCartLoading || cartItems.length === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    {isPlacingOrder ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing order…</>
                    ) : isCartLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading…</>
                    ) : (
                      <>Place Order <CheckCircle2 className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="card-luxury p-12 text-center space-y-6 opacity-0 animate-scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                  <PartyPopper className="w-10 h-10 text-green-500 animate-float" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-bold text-foreground">Order Confirmed!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you for your purchase. We've received your order and will begin processing it right away.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-6 py-3 text-accent">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-mono-custom text-sm font-medium">
                    Order #{order?._id ? order._id.toString().slice(-10).toUpperCase() : "PROCESSING"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link href="/" className="btn-primary px-8 py-3.5">
                    Back to Home
                  </Link>
                  <Link href="/orders" className="btn-outline px-8 py-3.5">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="card-luxury p-6 h-fit sticky top-20 space-y-5 opacity-0 animate-slide-in-right delay-200">
            <h3 className="font-display text-lg font-bold text-foreground">Order Summary</h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto no-scrollbar">
              {isCartLoading ? (
                <div className="space-y-2">
                  {[1,2].map(i => <div key={i} className="shimmer h-4 rounded" />)}
                </div>
              ) : cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                cartItems.map((it) => (
                  <div key={it._id} className="flex justify-between text-sm gap-3">
                    <span className="text-muted-foreground line-clamp-1 flex-1">{it?.product?.name} × {it?.quantity}</span>
                    <span className="text-foreground font-medium flex-shrink-0">${(it?.product?.price * it?.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={cartShipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {cartShipping === 0 ? "Free" : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">${cartTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-accent">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="bg-muted rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShoppingCart className="w-4 h-4 text-accent" />
              {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-green-500" />
              Secured with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
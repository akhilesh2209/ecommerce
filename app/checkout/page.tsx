'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ChevronRight, Lock, ShoppingCart, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation'

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Payment
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStepChange = (newStep: CheckoutStep) => {
    setStep(newStep)
  }

  const STEPS: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { id: 'shipping', label: 'Shipping', icon: '📍' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'review', label: 'Review', icon: '✓' },
    { id: 'confirmation', label: 'Confirmation', icon: '✓' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between md:space-x-0">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepChange(s.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    STEPS.findIndex((x) => x.id === step) > index
                      ? 'bg-green-500 text-white'
                      : step === s.id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  disabled={STEPS.findIndex((x) => x.id === step) < index}
                >
                  {STEPS.findIndex((x) => x.id === step) > index ? '✓' : index + 1}
                </button>
                <div className="hidden md:block ml-3">
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-colors ${
                      STEPS.findIndex((x) => x.id === step) > index
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <button
                  onClick={() => handleStepChange('payment')}
                  className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 rounded-lg border-2 border-accent bg-accent/5 p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      defaultChecked
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="font-medium text-foreground">Credit Card</span>
                  </label>

                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on Card"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border/50 bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStepChange('shipping')}
                    className="flex-1 rounded-lg border-2 border-border/50 text-foreground py-3 font-semibold hover:border-accent transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepChange('review')}
                    className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Review Order</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Review Order</h2>

                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.firstName} {formData.lastName}
                    <br />
                    {formData.address}
                    <br />
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Payment Method</h3>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Card ending in {formData.cardNumber.slice(-4)}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStepChange('payment')}
                    className="flex-1 rounded-lg border-2 border-border/50 text-foreground py-3 font-semibold hover:border-accent transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepChange('confirmation')}
                    className="flex-1 rounded-lg bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Place Order</span>
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="text-center space-y-6 py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Order Confirmed!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for your purchase. Your order has been confirmed and you will receive a confirmation email shortly.
                </p>
                <div className="inline-block rounded-lg bg-accent/10 px-6 py-3 text-sm font-mono text-accent">
                  Order #PrimeStore-2024-001234
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="rounded-lg border border-border/50 bg-card p-6 h-fit sticky top-20 space-y-6">
            <h3 className="font-semibold text-foreground text-lg">Order Summary</h3>

            <div className="space-y-3 border-b border-border/50 pb-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premium Item</span>
                  <span className="text-foreground">${(299.99).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">$749.97</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">$59.99</span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-accent">$809.96</span>
            </div>

            <div className="rounded-lg bg-accent/10 p-4 space-y-2">
              <div className="flex items-start space-x-2">
                <ShoppingCart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-accent font-medium">3 items in cart</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

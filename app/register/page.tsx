"use client"

import { useState } from "react"
import API from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Sparkles, Check } from "lucide-react"

// ─── Password Strength (original logic preserved) ─────────────────

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "8+ characters",   pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number",           pass: /[0-9]/.test(password) },
  ]
  const strength = checks.filter(c => c.pass).length
  const barColors = ["#ef4444", "#eab308", "#f97316", "#22c55e"]
  if (!password) return null

  return (
    <div className="space-y-2.5 mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{ background: i < strength ? barColors[strength] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {checks.map(({ label, pass }) => (
          <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
            style={{ color: pass ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: pass ? '#22c55e' : 'rgba(255,255,255,0.08)' }}>
              {pass && <Check className="w-2 h-2 text-black" strokeWidth={3} />}
            </div>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Input styles ─────────────────────────────────────────────────

const baseInput = "w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200 font-medium"
const baseStyle = { background: 'hsl(224 20% 9%)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }
const focusedStyle = { background: 'hsl(224 20% 10%)', border: '1px solid hsl(258 90% 66% / 0.6)', boxShadow: '0 0 0 3px hsl(258 90% 66% / 0.1)' }

// ─── Page ─────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { toast.error("Please fill in all fields"); return }
    setIsSubmitting(true)
    try {
      await API.post("/auth/register", form)
      toast.success("Account created successfully!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStyle = (name: string) => focused === name ? { ...baseStyle, ...focusedStyle } : baseStyle

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.07]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[110px] opacity-[0.05]" style={{ background: 'hsl(185 100% 55%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-16 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'hsl(224 20% 5%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(185 100% 55% / 0.4), transparent)' }} />

        <div className="relative z-10 flex items-center gap-3 opacity-0" style={{ animation: 'fadUp 0.5s ease 50ms forwards' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>PrimeStore</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-5 opacity-0" style={{ animation: 'fadUp 0.5s ease 150ms forwards' }}>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full"
              style={{ color: 'hsl(185 100% 65%)', background: 'hsl(185 100% 55% / 0.1)', border: '1px solid hsl(185 100% 55% / 0.2)' }}>
              Join today
            </span>
            <h1 className="text-6xl font-bold text-white leading-[0.95] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Start your<br />
              <span style={{ background: 'linear-gradient(135deg, hsl(185 100% 65%), hsl(258 90% 72%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>premium</span><br />
              journey.
            </h1>
          </div>
          <p className="text-base leading-relaxed max-w-xs opacity-0" style={{ color: 'rgba(255,255,255,0.4)', animation: 'fadUp 0.5s ease 250ms forwards' }}>
            Join over 2 million shoppers who trust PrimeStore for quality and value.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 opacity-0" style={{ animation: 'fadUp 0.5s ease 350ms forwards' }}>
            {[["2M+", "Members"], ["50K+", "Products"], ["150+", "Countries"]].map(([val, label]) => (
              <div key={label} className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'hsl(185 100% 65%)' }}>{val}</p>
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-3 opacity-0" style={{ animation: 'fadUp 0.5s ease 450ms forwards' }}>
            {['Free shipping on orders over $50', 'Exclusive member-only deals', '30-day hassle-free returns', '24/7 premium customer support'].map(benefit => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(185 100% 55% / 0.15)', border: '1px solid hsl(185 100% 55% / 0.3)' }}>
                  <Check className="w-3 h-3" style={{ color: 'hsl(185 100% 65%)' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm italic opacity-0" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Playfair Display', serif", animation: 'fadUp 0.5s ease 550ms forwards' }}>
          "Excellence is our standard."
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md space-y-8 opacity-0" style={{ animation: 'scIn 0.5s cubic-bezier(0.23,1,0.32,1) 100ms forwards' }}>

          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>PrimeStore</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Create account</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Already a member?{" "}
              <Link href="/login" className="font-semibold" style={{ color: 'hsl(258 90% 72%)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 82%)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 72%)' }}>
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Full name</label>
              <input type="text" placeholder="Jane Doe" className={baseInput} style={getStyle('name')}
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Email address</label>
              <input type="email" placeholder="jane@example.com" className={baseInput} style={getStyle('email')}
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                  className={`${baseInput} pr-12`} style={getStyle('password')}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <button onClick={handleRegister} disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)', marginTop: '0.5rem' }}
              onMouseEnter={e => { if (!isSubmitting) { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.5)' } }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)' }}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
              ) : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</span>{" "}
            and{" "}
            <span className="underline cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scIn  { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  )
}
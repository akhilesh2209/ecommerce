"use client"

import { useState } from "react"
import API from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppState } from "@/components/app-state-provider"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react"

const FEATURES = [
  { icon: ShieldCheck, text: 'Secure & encrypted checkout' },
  { icon: Zap,         text: 'Lightning-fast delivery tracking' },
  { icon: Sparkles,    text: 'AI-powered recommendations' },
]

const baseInput = "w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200 font-medium"
const baseStyle = { background: 'hsl(224 20% 9%)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }
const focusedStyle = { background: 'hsl(224 20% 10%)', border: '1px solid hsl(258 90% 66% / 0.6)', boxShadow: '0 0 0 3px hsl(258 90% 66% / 0.1)' }

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppState()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Please fill in all fields"); return }
    setIsSubmitting(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      await login(res.data.token, res.data._id)
      toast.success("Welcome back!")
      router.push("/")
    } catch { toast.error("Invalid credentials. Please try again.") }
    finally { setIsSubmitting(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin() }
  const getInputStyle = (name: string) => focused === name ? { ...baseStyle, ...focusedStyle } : baseStyle

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(224 20% 4%)' }}>

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.07]" style={{ background: 'hsl(258 90% 66%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[110px] opacity-[0.05]" style={{ background: 'hsl(327 80% 62%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-16 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'hsl(224 20% 5%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(258 90% 66% / 0.4), transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 opacity-0" style={{ animation: 'fadUp 0.5s ease 50ms forwards' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>PrimeStore</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-5 opacity-0" style={{ animation: 'fadUp 0.5s ease 150ms forwards' }}>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full"
              style={{ color: 'hsl(258 90% 72%)', background: 'hsl(258 90% 66% / 0.1)', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
              Welcome back
            </span>
            <h1 className="text-6xl font-bold text-white leading-[0.95] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Your premium<br />
              <span style={{ background: 'linear-gradient(135deg, hsl(258 90% 72%), hsl(327 80% 68%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>shopping</span><br />
              experience awaits.
            </h1>
          </div>
          <p className="text-base leading-relaxed max-w-xs opacity-0" style={{ color: 'rgba(255,255,255,0.4)', animation: 'fadUp 0.5s ease 250ms forwards' }}>
            Sign in to access your cart, track orders, and discover curated collections just for you.
          </p>
          <div className="space-y-4 opacity-0" style={{ animation: 'fadUp 0.5s ease 350ms forwards' }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(258 90% 66% / 0.1)', border: '1px solid hsl(258 90% 66% / 0.2)' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: 'hsl(258 90% 72%)' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl space-y-4 opacity-0"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadUp 0.5s ease 450ms forwards' }}>
            <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              "The best e-commerce experience I've ever had. Nothing even comes close."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>👩</div>
              <div>
                <p className="text-xs font-semibold text-white">Sarah Anderson</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Premium Member since 2021</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm italic opacity-0"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Playfair Display', serif", animation: 'fadUp 0.5s ease 550ms forwards' }}>
          "Quality is never an accident."
        </p>
      </div>

      {/* ── Right panel: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md space-y-8 opacity-0" style={{ animation: 'scIn 0.5s cubic-bezier(0.23,1,0.32,1) 100ms forwards' }}>

          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>PrimeStore</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Sign in</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              New here?{" "}
              <Link href="/register" className="font-semibold transition-colors"
                style={{ color: 'hsl(258 90% 72%)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 82%)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 72%)' }}>
                Create an account
              </Link>
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Email address</label>
              <input type="email" placeholder="hello@example.com" className={baseInput}
                style={getInputStyle('email')} value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} onKeyDown={handleKeyDown} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Password</label>
                <button className="text-xs font-medium" style={{ color: 'hsl(258 90% 72%)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 82%)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'hsl(258 90% 72%)' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Your password" className={`${baseInput} pr-12`}
                  style={getInputStyle('password')} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} onKeyDown={handleKeyDown} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleLogin} disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, hsl(258 90% 60%), hsl(327 80% 60%))', boxShadow: '0 8px 32px hsl(258 90% 66% / 0.3)' }}
              onMouseEnter={e => { if (!isSubmitting) { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 40px hsl(258 90% 66% / 0.5)' } }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px hsl(258 90% 66% / 0.3)' }}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map(provider => (
              <button key={provider} onClick={() => toast.info(`${provider} login coming soon`)}
                className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'rgba(255,255,255,0.6)' }}>
                {provider === "Google" ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.2zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                )}
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</span>{" "}
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
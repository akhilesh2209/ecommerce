"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-state-provider";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      await login(res.data.token, res.data._id);
      toast.success("Welcome back!");
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex">
      {/* Left Panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary flex-col justify-between p-16">
        {/* Background pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(25 85% 52% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(43 74% 49% / 0.1) 0%, transparent 40%)`,
        }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(hsl(30 15% 97%) 1px, transparent 1px), linear-gradient(90deg, hsl(30 15% 97%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Brand */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground tracking-tight">
              PrimeStore
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 opacity-0 animate-fade-in-up delay-200">
            <p className="section-label text-accent">Welcome back</p>
            <h1 className="font-display text-5xl font-bold text-primary-foreground leading-tight">
              Your premium
              <br />
              <span className="gradient-text-gold">shopping</span>
              <br />
              experience awaits.
            </h1>
          </div>
          <p className="text-primary-foreground/60 text-lg leading-relaxed max-w-sm opacity-0 animate-fade-in-up delay-300">
            Sign in to access your cart, track orders, and discover curated collections just for you.
          </p>

          {/* Features */}
          <div className="space-y-4 opacity-0 animate-fade-in-up delay-400">
            {[
              { icon: ShieldCheck, text: "Secure & encrypted checkout" },
              { icon: Zap, text: "Lightning-fast delivery tracking" },
              { icon: Sparkles, text: "Personalized recommendations" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-primary-foreground/70 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 opacity-0 animate-fade-in-up delay-500">
          <p className="text-primary-foreground/40 text-sm italic font-display">
            "Quality is never an accident."
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 opacity-0 animate-scale-in delay-100">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">PrimeStore</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="text-accent font-medium hover:underline underline-offset-4 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/80">
                Email address
              </label>
              <div className={`relative transition-all duration-200 ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="input-luxury pr-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground/80">
                  Password
                </label>
                <button className="text-xs text-accent hover:underline underline-offset-4 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className={`relative transition-all duration-200 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-luxury pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base mt-2"
              style={{ marginTop: '1.5rem' }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-widest">
                or continue with
              </span>
            </div>
          </div>

          {/* Social logins (UI only) */}
          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((provider) => (
              <button
                key={provider}
                className="btn-outline py-2.5 text-sm"
                onClick={() => toast.info(`${provider} login coming soon`)}
              >
                {provider === "Google" ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.83.02 3.02 2.65 4.03 2.68 4.04l-.06.2zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-foreground transition-colors">Terms</span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
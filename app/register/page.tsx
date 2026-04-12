"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Sparkles, Check } from "lucide-react";

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  const colors = ["bg-destructive", "bg-yellow-500", "bg-orange-500", "bg-green-500"];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={`flex items-center gap-1 text-xs transition-colors ${
              pass ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${pass ? "bg-green-500" : "bg-muted"}`}>
              {pass && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
            </div>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary flex-col justify-between p-16">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, hsl(25 85% 52% / 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, hsl(43 74% 49% / 0.1) 0%, transparent 40%)`,
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(hsl(30 15% 97%) 1px, transparent 1px), linear-gradient(90deg, hsl(30 15% 97%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground tracking-tight">PrimeStore</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="opacity-0 animate-fade-in-up delay-200 space-y-3">
            <p className="section-label text-accent">Join today</p>
            <h1 className="font-display text-5xl font-bold text-primary-foreground leading-tight">
              Start your
              <br />
              <span className="gradient-text-gold">premium</span>
              <br />
              journey.
            </h1>
          </div>
          <p className="text-primary-foreground/60 text-lg opacity-0 animate-fade-in-up delay-300">
            Join over 2 million shoppers who trust PrimeStore for quality and value.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-in-up delay-400">
            {[["2M+", "Members"], ["50K+", "Products"], ["150+", "Countries"]].map(([val, label]) => (
              <div key={label} className="text-center p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
                <p className="font-display text-2xl font-bold text-accent">{val}</p>
                <p className="text-primary-foreground/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-foreground/40 text-sm italic font-display opacity-0 animate-fade-in-up delay-500">
          "Excellence is our standard."
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 opacity-0 animate-scale-in delay-100">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">PrimeStore</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground">
              Already a member?{" "}
              <Link href="/login" className="text-accent font-medium hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/80">Full name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="input-luxury"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/80">Email address</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="input-luxury"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="input-luxury pr-12"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base"
              style={{ marginTop: '1.5rem' }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
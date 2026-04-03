"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, Target, Star } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password. Try demo@skopos.dev / password123");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 gradient-primary p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black text-base">S</span>
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight">Skopos</div>
            <div className="text-white/60 text-xs font-medium">Career Intelligence Platform</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Everything you need</div>
          {[
            { icon: Briefcase, title: "65+ Jobs aggregated daily", desc: "From Indeed, LinkedIn & Glassdoor" },
            { icon: Target, title: "AI match scoring", desc: "Know your fit before applying" },
            { icon: Star, title: "Brand & interview prep", desc: "Full career support in one place" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{item.title}</div>
                <div className="text-white/60 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
          <p className="text-white/90 text-sm leading-relaxed italic">
            "Skopos helped me find and land a Senior Engineer role at Google in just 3 weeks."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">AK</div>
            <div>
              <div className="text-white text-xs font-semibold">Alex Kim</div>
              <div className="text-white/50 text-xs">Senior Engineer @ Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-slate-900">Skopos</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1.5">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Demo hint */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 mb-6">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-indigo-700">Demo account: </span>
              <span className="text-indigo-600">demo@skopos.dev / password123</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 animate-scale-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white gradient-primary shadow-glow hover:opacity-90 hover:shadow-glow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

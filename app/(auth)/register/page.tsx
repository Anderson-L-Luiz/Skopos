"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Briefcase, TrendingUp, Award } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? null : password.length < 8 ? "weak" : password.length < 12 ? "good" : "strong";

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-32 translate-x-32" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-white font-black text-base">S</span>
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight">Skopos</div>
            <div className="text-slate-400 text-xs font-medium">Career Intelligence Platform</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Take control of your<br />
              <span className="gradient-text">career journey.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join professionals who use Skopos to find better jobs, faster — with AI-powered tools built for modern job seekers.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Briefcase, text: "Aggregates jobs from 3+ platforms daily", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: TrendingUp, text: "AI match scoring with gap analysis", color: "text-violet-400", bg: "bg-violet-500/10" },
              { icon: Award, text: "Personal brand & interview preparation", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm text-slate-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { val: "65+", label: "Live jobs" },
            { val: "5", label: "Career tools" },
            { val: "100%", label: "Free to start" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <div className="text-white font-black text-xl">{s.val}</div>
              <div className="text-slate-400 text-xs font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-slate-900">Skopos</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1.5">Create your account</h1>
            <p className="text-slate-500 text-sm">Start your career intelligence journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
              {/* Password strength */}
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "good", "strong"].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i === 0 && passwordStrength !== null ? "bg-rose-400" :
                          i === 1 && (passwordStrength === "good" || passwordStrength === "strong") ? "bg-amber-400" :
                          i === 2 && passwordStrength === "strong" ? "bg-emerald-400" :
                          "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength === "weak" ? "text-rose-500" :
                    passwordStrength === "good" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
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
              className="w-full py-3 rounded-xl text-sm font-bold text-white gradient-primary shadow-glow hover:opacity-90 hover:shadow-glow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our Terms of Service.
          </p>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

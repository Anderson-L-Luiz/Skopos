"use client";
import { useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, Target, Star } from "lucide-react";
import { useEffect } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }>>({});

  useEffect(() => {
    getProviders().then((p) => {
      if (p) setProviders(p);
    });
  }, []);

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
      setError("Invalid email or password. Please check your credentials and try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuth = (providerId: string) => {
    setOauthLoading(providerId);
    signIn(providerId, { callbackUrl: "/dashboard" });
  };

  const oauthProviders = Object.values(providers).filter((p) => p.id !== "credentials");
  const providerMeta: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    google: { icon: <GoogleIcon />, bg: "bg-white border border-slate-200 hover:bg-slate-50", text: "text-slate-700" },
    github: { icon: <GitHubIcon />, bg: "bg-slate-900 hover:bg-slate-800", text: "text-white" },
    twitter: { icon: <XIcon />, bg: "bg-black hover:bg-slate-900", text: "text-white" },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 gradient-primary p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black text-base">S</span>
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight">Skopos</div>
            <div className="text-white/60 text-xs font-medium">Career Intelligence Platform</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Everything you need</div>
          {[
            { icon: Briefcase, title: "Real jobs from 4+ sources", desc: "Adzuna, RemoteOK, Arbeitnow & more" },
            { icon: Target, title: "AI match scoring", desc: "Know your fit before applying" },
            { icon: Star, title: "Full career toolkit", desc: "CV, cover letters, salary, interviews" },
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

        <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
          <p className="text-white/90 text-sm leading-relaxed italic">
            &quot;Skopos helped me find and land a Senior Engineer role at Google in just 3 weeks.&quot;
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

          {/* Demo hint — only shown in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 mb-6">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-700">Demo account: </span>
                <span className="text-indigo-600">demo@skopos.dev / password123</span>
              </div>
            </div>
          )}

          {/* OAuth Buttons */}
          {oauthProviders.length > 0 && (
            <>
              <div className="space-y-2.5 mb-6">
                {oauthProviders.map((provider) => {
                  const meta = providerMeta[provider.id] || providerMeta.google;
                  return (
                    <button
                      key={provider.id}
                      onClick={() => handleOAuth(provider.id)}
                      disabled={oauthLoading !== null}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold ${meta.bg} ${meta.text} transition-all flex items-center justify-center gap-3 disabled:opacity-60`}
                    >
                      {oauthLoading === provider.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        meta.icon
                      )}
                      Continue with {provider.name}
                    </button>
                  );
                })}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-50 px-3 text-slate-400 font-medium">or continue with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 animate-scale-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium">{error}</p>
              </div>
            )}

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

"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Target, Zap, Star, GraduationCap, CheckCircle2, TrendingUp, Users, Award } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    label: "Job Aggregation",
    title: "Every job, one place",
    desc: "Aggregates from Indeed, LinkedIn, and Glassdoor. Normalized, deduplicated, and ranked by source trust score.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    label: "Smart CV Builder",
    title: "Your full story, told well",
    desc: "Upload your CV and enrich it automatically from your LinkedIn, GitHub, and Google Scholar profiles.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Target,
    label: "Match Scoring",
    title: "Know before you apply",
    desc: "AI-powered scoring against your full profile. Open, within reach, or stretch — with detailed gap analysis.",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Star,
    label: "Brand Advisor",
    title: "Stand out online",
    desc: "Analyze your LinkedIn, GitHub, X, and Instagram presence. Get an actionable content strategy.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: GraduationCap,
    label: "Interview Prep",
    title: "Walk in prepared",
    desc: "Company intelligence, tailored questions by role and difficulty, and structured prep plans.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    label: "Career Path",
    title: "See your trajectory",
    desc: "Model your career path from current role to target with timeline estimates and skill requirements.",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

const stats = [
  { value: "65+", label: "Jobs indexed daily", icon: Briefcase },
  { value: "3", label: "Job sources aggregated", icon: Zap },
  { value: "5", label: "Career tools in one", icon: Award },
  { value: "100%", label: "Profile enrichment", icon: Users },
];

const benefits = [
  "AI match scoring across all job listings",
  "CV enrichment from LinkedIn, GitHub & Scholar",
  "Personal brand analysis with action plan",
  "Company intelligence for interviews",
  "Career trajectory modeling",
  "Gap analysis with learning recommendations",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm tracking-tight">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Skopos</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#stats" className="hover:text-slate-900 transition-colors">Platform</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary shadow-glow hover:opacity-90 transition-opacity"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-100/40 via-violet-100/40 to-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute -top-10 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Career Intelligence Platform — All 5 tools in one
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 animate-slide-up leading-[1.05]">
              Land your dream job{" "}
              <span className="gradient-text">faster.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-slide-up stagger-1 leading-relaxed">
              Skopos aggregates jobs from all major platforms, matches them to your full profile
              with AI scoring, builds your personal brand, and prepares you for every interview.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white gradient-primary shadow-card-lg hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 bg-white border border-slate-200 shadow-card hover:shadow-card-md hover:border-slate-300 transition-all duration-200"
              >
                Sign in to your account
              </Link>
            </div>

            {/* Social proof */}
            <p className="text-sm text-slate-400 mt-6 animate-slide-up stagger-3">
              No credit card required · Free to get started
            </p>
          </div>

          {/* Hero visual — UI preview mockup */}
          <div className="mt-20 max-w-5xl mx-auto animate-slide-up stagger-4">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card-xl overflow-hidden">
                {/* Mock header */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-400 font-medium">
                      app.skopos.dev/dashboard
                    </div>
                  </div>
                </div>

                {/* Mock UI content */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-52 border-r border-slate-100 p-4 hidden md:block">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 rounded-lg gradient-primary" />
                      <span className="font-bold text-sm text-slate-900">Skopos</span>
                    </div>
                    {["Dashboard", "Jobs", "CV Builder", "Matches", "Brand", "Interview"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-xs font-medium ${
                          i === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-sm ${i === 0 ? "bg-indigo-300" : "bg-slate-200"}`} />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content area */}
                  <div className="flex-1 p-6 bg-slate-50/50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Jobs Found", val: "65", color: "bg-blue-100 text-blue-700" },
                        { label: "Matches", val: "24", color: "bg-indigo-100 text-indigo-700" },
                        { label: "Applied", val: "8", color: "bg-violet-100 text-violet-700" },
                        { label: "Brand Score", val: "78", color: "bg-emerald-100 text-emerald-700" },
                      ].map((s) => (
                        <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs">
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${s.color} mb-2`}>
                            {s.val}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[92, 74, 58].map((score, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {["Senior Engineer", "Product Manager", "Data Analyst"][i]}
                              </div>
                              <div className="text-[10px] text-slate-400">{["Google", "Stripe", "Airbnb"][i]}</div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              score > 80 ? "bg-emerald-100 text-emerald-700" :
                              score > 60 ? "bg-amber-100 text-amber-700" :
                              "bg-rose-100 text-rose-700"
                            }`}>{score}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score > 80 ? "bg-emerald-400" : score > 60 ? "bg-amber-400" : "bg-rose-400"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-8 top-24 animate-float bg-white rounded-xl shadow-card-lg border border-slate-100 p-3 hidden lg:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Match Found</div>
                  <div className="text-[11px] text-slate-500">92% — Senior Engineer @ Google</div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-16 animate-float bg-white rounded-xl shadow-card-lg border border-slate-100 p-3 hidden lg:flex items-center gap-2.5" style={{ animationDelay: "1.5s" }}>
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Brand Score</div>
                  <div className="text-[11px] text-slate-500">↑ 12 pts this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="border-y border-slate-100 bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-slate-900 tabular mb-1">{s.value}</div>
                <div className="text-sm text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
              Five powerful tools
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Everything you need to{" "}
              <span className="gradient-text">get hired.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From finding the right job to nailing the interview — Skopos covers every step of your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.label}
                className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{f.label}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
                Simple setup
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">
                Up and running in{" "}
                <span className="gradient-text">minutes.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Create your profile", desc: "Upload your CV and add your LinkedIn, GitHub, and social profile links." },
                  { step: "02", title: "Enrich automatically", desc: "Skopos scrapes your public presence and builds a comprehensive career profile." },
                  { step: "03", title: "Discover & match", desc: "Browse 65+ live job listings scored against your profile. Know your fit before you apply." },
                  { step: "04", title: "Prepare & apply", desc: "Use interview prep tools, company intelligence, and career path modeling to maximize your success." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-glow">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8">
              <div className="text-sm font-semibold text-slate-700 mb-5">What's included</div>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-violet-900/50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Ready to take control of{" "}
            <span className="gradient-text">your career?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join professionals using Skopos to find better jobs, faster.
            No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white gradient-primary shadow-glow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
          >
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-primary" />
            <span className="font-bold text-slate-900">Skopos</span>
            <span className="text-slate-400 text-sm ml-2">Career Intelligence Platform</span>
          </div>
          <div className="text-sm text-slate-400">
            Built to help you get hired.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Briefcase, Target, Star, FileText, Loader2, RefreshCw, ArrowRight, TrendingUp, CheckCircle2, Clock, Zap, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import Link from "next/link";

interface Stats {
  totalJobs: number;
  totalMatches: number;
  brandScore: number;
  applications: { total: number; saved?: number; applied?: number; interviewing?: number };
  matchBreakdown: { open: number; withinReach: number; stretch: number };
  profileComplete: boolean;
}

const MATCH_COLORS = ["#10b981", "#f59e0b", "#f43f5e"];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/stats");
    if (res.ok) setStats(await res.json());
    setLoading(false);
  };

  const seedJobs = async () => {
    setSeeding(true);
    await fetch("/api/jobs/scrape", { method: "POST" });
    await fetchStats();
    setSeeding(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const matchData = stats ? [
    { name: "Open", value: stats.matchBreakdown.open || 0, fill: "#10b981" },
    { name: "Within Reach", value: stats.matchBreakdown.withinReach || 0, fill: "#f59e0b" },
    { name: "Stretch", value: stats.matchBreakdown.stretch || 0, fill: "#f43f5e" },
  ].filter(d => d.value > 0) : [];

  const brandData = stats ? [{ name: "Score", value: stats.brandScore, fill: "url(#brandGrad)" }] : [];

  const quickActions = [
    { label: "Browse Jobs", href: "/jobs", icon: Briefcase, color: "text-blue-600 bg-blue-50", desc: "View 65+ listings" },
    { label: "Build CV", href: "/cv", icon: FileText, color: "text-violet-600 bg-violet-50", desc: "Enrich your profile" },
    { label: "See Matches", href: "/matches", icon: Target, color: "text-indigo-600 bg-indigo-50", desc: "Scored for you" },
    { label: "Brand Analysis", href: "/brand", icon: Star, color: "text-amber-600 bg-amber-50", desc: "Improve presence" },
    { label: "Interview Prep", href: "/interview", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50", desc: "Practice questions" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Your career intelligence overview"
        actions={
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 shadow-card-lg">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
              <div className="absolute bottom-0 left-32 w-32 h-32 bg-white/5 rounded-full translate-y-16" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Career Intelligence</span>
                  </div>
                  <h2 className="text-xl font-black text-white mb-1">
                    Good to see you, {firstName}! 👋
                  </h2>
                  <p className="text-white/70 text-sm">
                    {stats?.totalJobs === 0
                      ? "Load job listings to get started with AI matching."
                      : `${stats?.totalJobs} jobs available · ${stats?.totalMatches} matched to your profile`
                    }
                  </p>
                </div>
                {stats?.totalJobs === 0 && (
                  <button
                    onClick={seedJobs}
                    disabled={seeding}
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-card-md hover:shadow-card-lg disabled:opacity-60 transition-all"
                  >
                    {seeding
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                      : <><RefreshCw className="w-4 h-4" /> Load Jobs</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Profile incomplete warning */}
            {!stats?.profileComplete && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">Complete your profile for better matches</p>
                    <p className="text-xs text-amber-700 mt-0.5">Add skills, current role, and social links to unlock AI scoring</p>
                  </div>
                </div>
                <Link
                  href="/cv"
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
                >
                  Complete Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Jobs Available"
                value={stats?.totalJobs ?? 0}
                subtitle="From 3 job platforms"
                icon={Briefcase}
                color="blue"
              />
              <StatsCard
                title="Job Matches"
                value={stats?.totalMatches ?? 0}
                subtitle="Scored against profile"
                icon={Target}
                color="indigo"
              />
              <StatsCard
                title="Applications"
                value={stats?.applications.total ?? 0}
                subtitle={`${stats?.applications.interviewing ?? 0} in interviews`}
                icon={FileText}
                color="violet"
              />
              <StatsCard
                title="Brand Score"
                value={stats?.brandScore ? `${stats.brandScore}/100` : "—"}
                subtitle="Professional presence"
                icon={Star}
                color="amber"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Match breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Match Breakdown</h3>
                    <p className="text-xs text-slate-400 mt-0.5">How jobs are scored against you</p>
                  </div>
                  <Link href="/matches" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {matchData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={matchData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {matchData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [v, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 flex-1">
                      {[
                        { label: "Open (>70)", value: stats?.matchBreakdown.open ?? 0, color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700" },
                        { label: "Within Reach", value: stats?.matchBreakdown.withinReach ?? 0, color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700" },
                        { label: "Stretch (<40)", value: stats?.matchBreakdown.stretch ?? 0, color: "#f43f5e", bg: "bg-rose-50", text: "text-rose-700" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${item.bg} ${item.text}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">Total scored</span>
                          <span className="text-xs font-bold text-slate-800">{stats?.totalMatches ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-36 flex flex-col items-center justify-center gap-3">
                    <Target className="w-8 h-8 text-slate-200" />
                    <p className="text-xs text-slate-400 font-medium">No matches yet</p>
                    <Link href="/matches" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      Score jobs now →
                    </Link>
                  </div>
                )}
              </div>

              {/* Brand score */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Brand Score</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Your professional online presence</p>
                  </div>
                  <Link href="/brand" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Analyze <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {stats && stats.brandScore > 0 ? (
                  <div className="flex items-center gap-6">
                    <div className="relative w-[140px] h-[140px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="55%"
                          outerRadius="85%"
                          data={brandData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <defs>
                            <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <RadialBar
                            dataKey="value"
                            max={100}
                            cornerRadius={8}
                            background={{ fill: "#f1f5f9" }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">{stats.brandScore}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
                      </div>
                    </div>
                    <div className="space-y-2 flex-1">
                      {[
                        { label: "Profile completeness", val: Math.min(stats.brandScore + 10, 100) },
                        { label: "Content quality", val: Math.max(stats.brandScore - 5, 0) },
                        { label: "Engagement rate", val: Math.max(stats.brandScore - 15, 0) },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 font-medium">{item.label}</span>
                            <span className="text-slate-700 font-bold">{item.val}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-primary rounded-full transition-all duration-700"
                              style={{ width: `${item.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-36 flex flex-col items-center justify-center gap-3">
                    <Star className="w-8 h-8 text-slate-200" />
                    <p className="text-xs text-slate-400 font-medium">No brand analysis yet</p>
                    <Link href="/brand" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      Analyze brand now →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 text-center"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{action.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{action.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50", text: "65 jobs aggregated from 3 sources", time: "Just now" },
                  { icon: Target, color: "text-indigo-500 bg-indigo-50", text: "AI match scoring ready to run", time: "Available" },
                  { icon: Star, color: "text-amber-500 bg-amber-50", text: "Brand analysis available", time: "Run now" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{item.text}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MatchCard } from "@/components/matches/MatchCard";
import { Loader2, RefreshCw, Target, Zap } from "lucide-react";
import type { MatchResult } from "@/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "within_reach" | "stretch">("all");

  const fetchMatches = async () => {
    setLoading(true);
    const res = await fetch("/api/matches");
    if (res.ok) setMatches(await res.json());
    setLoading(false);
  };

  const scoreAll = async () => {
    setScoring(true);
    await fetch("/api/matches/score-all", { method: "POST" });
    await fetchMatches();
    setScoring(false);
  };

  useEffect(() => { fetchMatches(); }, []);

  const open = matches.filter((m) => m.category === "open");
  const withinReach = matches.filter((m) => m.category === "within_reach");
  const stretch = matches.filter((m) => m.category === "stretch");

  const tabs = [
    { key: "all" as const, label: "All Matches", count: matches.length, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
    { key: "open" as const, label: "Open", count: open.length, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { key: "within_reach" as const, label: "Within Reach", count: withinReach.length, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { key: "stretch" as const, label: "Stretch", count: stretch.length, color: "text-rose-700 bg-rose-50 border-rose-200" },
  ];

  const currentData = {
    all: matches,
    open,
    within_reach: withinReach,
    stretch,
  }[activeTab];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Job Matches"
        subtitle="AI-scored opportunities based on your profile"
        actions={
          <button
            onClick={scoreAll}
            disabled={scoring}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 transition-colors"
          >
            {scoring
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scoring...</>
              : <><Zap className="w-3.5 h-3.5" /> Re-Score All</>
            }
          </button>
        }
      />

      <div className="flex-1 p-6 space-y-5 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Target className="w-7 h-7 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-800 mb-1">No matches yet</p>
              <p className="text-sm text-slate-400">Score jobs against your profile to see how well they match.</p>
            </div>
            <button
              onClick={scoreAll}
              disabled={scoring}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white gradient-primary shadow-glow hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {scoring
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Scoring...</>
                : <><Zap className="w-4 h-4" /> Score All Jobs</>
              }
            </button>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Open Matches", count: open.length, desc: "Score > 70", color: "border-emerald-100 bg-emerald-50", numColor: "text-emerald-700", dotColor: "bg-emerald-500" },
                { label: "Within Reach", count: withinReach.length, desc: "Score 40–70", color: "border-amber-100 bg-amber-50", numColor: "text-amber-700", dotColor: "bg-amber-500" },
                { label: "Stretch Goals", count: stretch.length, desc: "Score < 40", color: "border-rose-100 bg-rose-50", numColor: "text-rose-700", dotColor: "bg-rose-500" },
              ].map((item) => (
                <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                  <div className={`text-2xl font-black ${item.numColor} tabular`}>{item.count}</div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeTab === tab.key
                      ? tab.color + " shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    activeTab === tab.key ? "bg-white/60" : "bg-slate-100"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Grid */}
            {currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Target className="w-10 h-10 text-slate-200" />
                <p className="text-sm text-slate-400 font-medium">No matches in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentData.map((match, i) => (
                  <div
                    key={match.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s`, opacity: 0 }}
                  >
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BrandAnalysis } from "@/components/brand/BrandAnalysis";
import { ContentCalendar } from "@/components/brand/ContentCalendar";
import { Loader2, Zap, Star, ArrowRight, Linkedin, Twitter, Github, Instagram, Calendar } from "lucide-react";
import type { BrandAnalysis as BrandAnalysisType, ContentCalendar as ContentCalendarType } from "@/types";
import Link from "next/link";

const platforms = [
  { icon: Linkedin, name: "LinkedIn", color: "text-sky-600 bg-sky-50 border-sky-200", desc: "Professional profile & connections" },
  { icon: Github, name: "GitHub", color: "text-slate-700 bg-slate-100 border-slate-200", desc: "Code & open source contributions" },
  { icon: Twitter, name: "X (Twitter)", color: "text-slate-800 bg-slate-100 border-slate-200", desc: "Thought leadership & engagement" },
  { icon: Instagram, name: "Instagram", color: "text-pink-600 bg-pink-50 border-pink-200", desc: "Visual presence & reach" },
];

export default function BrandPage() {
  const [analysis, setAnalysis] = useState<BrandAnalysisType | null>(null);
  const [calendar, setCalendar] = useState<ContentCalendarType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "calendar">("analysis");

  const runAnalysis = async () => {
    setLoading(true);
    const res = await fetch("/api/brand/analyze", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setAnalysis(data.analysis);
      setActiveTab("analysis");
    }
    setLoading(false);
  };

  const loadCalendar = async () => {
    const res = await fetch("/api/brand/calendar");
    if (res.ok) {
      const data = await res.json();
      setCalendar(data.calendar);
      setActiveTab("calendar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Brand Advisor"
        subtitle="Analyze and improve your professional online presence"
        actions={
          !analysis && !loading ? (
            <button
              onClick={runAnalysis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" /> Analyze Brand
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {!analysis && !loading && (
          <div className="max-w-3xl space-y-5">
            {/* Hero card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 shadow-card-lg">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Analyze Your Personal Brand</h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-6">
                  We&apos;ll score your LinkedIn, GitHub, X (Twitter), and Instagram profiles to give you
                  an actionable strategy for building your professional presence.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={runAnalysis}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-700 font-bold text-sm shadow-card-md hover:shadow-card-lg hover:scale-[1.02] transition-all"
                  >
                    <Zap className="w-4 h-4" /> Run Brand Analysis
                  </button>
                  <Link
                    href="/cv"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors"
                  >
                    Add profile URLs first <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Platform cards */}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">Platforms we analyze</p>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <div key={p.name} className={`flex items-center gap-3 p-4 rounded-xl border bg-white shadow-card`}>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${p.color}`}>
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you get */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <p className="text-sm font-bold text-slate-800 mb-4">What you&apos;ll get</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Overall brand score", desc: "Composite 0–100 score" },
                  { title: "Platform breakdown", desc: "Score per network" },
                  { title: "Content strategy", desc: "What to post & when" },
                  { title: "Portfolio suggestions", desc: "Projects to showcase" },
                  { title: "Improvement tips", desc: "Actionable next steps" },
                  { title: "Benchmark comparison", desc: "vs industry average" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-700">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-80 gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Star className="w-7 h-7 text-amber-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-900 mb-1">Analyzing your brand...</p>
              <p className="text-sm text-slate-400">Scanning LinkedIn, GitHub, X, and Instagram profiles</p>
            </div>
            <div className="flex gap-2">
              {["LinkedIn", "GitHub", "Twitter", "Instagram"].map((p, i) => (
                <span
                  key={p}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500"
                  style={{ animation: `fadeIn 0.3s ease ${i * 0.2}s both` }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis complete</p>
                <h3 className="text-lg font-black text-slate-900">Your Brand Report</h3>
              </div>
              <button
                onClick={runAnalysis}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" /> Re-analyze
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "analysis"
                    ? "border-amber-500 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Brand Analysis
                </div>
              </button>
              <button
                onClick={loadCalendar}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "calendar"
                    ? "border-purple-500 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Content Calendar
                </div>
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "analysis" && <BrandAnalysis analysis={analysis} />}
            {activeTab === "calendar" && calendar && <ContentCalendar calendar={calendar} />}
          </div>
        )}
      </div>
    </div>
  );
}

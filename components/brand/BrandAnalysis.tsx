import { CheckCircle2, Lightbulb, TrendingUp, Globe, ArrowRight } from "lucide-react";
import type { BrandAnalysis as BrandAnalysisType } from "@/types";

interface BrandAnalysisProps {
  analysis: BrandAnalysisType;
}

function scoreLabel(s: number) {
  if (s >= 70) return { text: "Strong", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", bar: "from-emerald-400 to-emerald-600" };
  if (s >= 40) return { text: "Good", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", bar: "from-amber-400 to-amber-600" };
  return { text: "Needs Work", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", bar: "from-rose-400 to-rose-600" };
}

function formatKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

export function BrandAnalysis({ analysis }: BrandAnalysisProps) {
  const overall = scoreLabel(analysis.overallScore);

  return (
    <div className="space-y-5">
      {/* Overall score hero */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Score ring */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke={analysis.overallScore >= 70 ? "#10b981" : analysis.overallScore >= 40 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - analysis.overallScore / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 leading-none">{analysis.overallScore}</span>
                <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-black text-slate-900">Overall Brand Score</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${overall.bg} ${overall.color}`}>
                  {overall.text}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                {analysis.overallScore >= 70
                  ? "You have a strong professional brand. Keep up the great work with consistent content."
                  : analysis.overallScore >= 40
                  ? "Good foundation with clear opportunities for growth. Focus on the recommendations below."
                  : "Your brand needs attention. Start with the quick wins in the recommendations section."}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className={`h-full bg-gradient-to-r ${overall.bar} transition-all duration-700`}
            style={{ width: `${analysis.overallScore}%` }}
          />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Score Breakdown</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(analysis.breakdown).map(([key, val]) => {
            const s = scoreLabel(val as number);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">{formatKey(key)}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${s.bg} ${s.color}`}>
                    {val as number}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${s.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${val as number}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations + Content Strategy side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content strategy */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Content Strategy</h3>
          </div>
          <div className="space-y-3">
            {analysis.contentStrategy.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio suggestions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Portfolio Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.portfolioSuggestions.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded-lg gradient-emerald flex items-center justify-center shrink-0 mt-0.5">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

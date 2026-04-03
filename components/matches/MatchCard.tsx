import { MapPin, DollarSign, ChevronRight, AlertTriangle, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/types";

interface MatchCardProps {
  match: MatchResult;
}

const categoryConfig = {
  open: {
    label: "Open",
    badge: "category-open",
    bar: "from-emerald-400 to-emerald-600",
    scoreColor: "text-emerald-700",
    ring: "#10b981",
  },
  within_reach: {
    label: "Within Reach",
    badge: "category-reach",
    bar: "from-amber-400 to-amber-600",
    scoreColor: "text-amber-700",
    ring: "#f59e0b",
  },
  stretch: {
    label: "Stretch",
    badge: "category-stretch",
    bar: "from-rose-400 to-rose-600",
    scoreColor: "text-rose-700",
    ring: "#f43f5e",
  },
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative w-[72px] h-[72px] shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-slate-900 leading-none">{score}</span>
        <span className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export function MatchCard({ match }: MatchCardProps) {
  const cfg = categoryConfig[match.category];
  const gap = match.gapAnalysis;
  const job = match.job;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Score bar at top */}
      <div className="h-1 w-full">
        <div
          className={cn("h-full bg-gradient-to-r", cfg.bar)}
          style={{ width: `${match.score}%` }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <ScoreRing score={match.score} color={cfg.ring} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-700 transition-colors">
                {job.title}
              </h3>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap", cfg.badge)}>
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {job.company}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.location && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <DollarSign className="w-3 h-3" />
                  ${((job.salaryMin || 0) / 1000).toFixed(0)}k–${((job.salaryMax || 0) / 1000).toFixed(0)}k
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths */}
        {gap.strengths && gap.strengths.length > 0 && (
          <div className="space-y-1 mb-3">
            {gap.strengths.slice(0, 2).map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-600 font-medium">{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Missing skills */}
        {gap.missingSkills && gap.missingSkills.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-semibold text-amber-700">Skills to develop</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {gap.missingSkills.slice(0, 3).map((s: string) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {s}
                </span>
              ))}
              {gap.missingSkills.length > 3 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500">
                  +{gap.missingSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-3 border-t border-slate-50">
          <Link
            href={`/jobs/${job.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            View Job Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

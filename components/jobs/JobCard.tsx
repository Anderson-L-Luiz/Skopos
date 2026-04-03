import { MapPin, DollarSign, Clock, ExternalLink, Wifi, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { JobListing } from "@/types";

interface JobCardProps {
  job: JobListing;
  matchScore?: number;
}

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "";
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function timeAgo(date?: Date | string | null): string {
  if (!date) return "Recently";
  const d = new Date(date);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const sourceConfig: Record<string, { label: string; color: string }> = {
  indeed: { label: "Indeed", color: "bg-blue-50 text-blue-700" },
  linkedin: { label: "LinkedIn", color: "bg-sky-50 text-sky-700" },
  glassdoor: { label: "Glassdoor", color: "bg-emerald-50 text-emerald-700" },
};

const companyInitial = (company: string) => company.charAt(0).toUpperCase();

const companyColors = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
  "from-indigo-400 to-indigo-600",
];

function getCompanyColor(company: string): string {
  const idx = company.charCodeAt(0) % companyColors.length;
  return companyColors[idx];
}

export function JobCard({ job, matchScore }: JobCardProps) {
  const skills: string[] = Array.isArray(job.skills)
    ? job.skills
    : JSON.parse((job.skills as unknown as string) || "[]");

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const src = sourceConfig[job.source] ?? { label: job.source, color: "bg-slate-50 text-slate-600" };
  const scoreColor = matchScore !== undefined
    ? matchScore >= 70 ? "bg-emerald-50 text-emerald-700"
    : matchScore >= 40 ? "bg-amber-50 text-amber-700"
    : "bg-rose-50 text-rose-700"
    : "";

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top accent bar based on score */}
      {matchScore !== undefined && (
        <div
          className="h-0.5 w-full"
          style={{
            background: matchScore >= 70
              ? "linear-gradient(90deg, #10b981, #059669)"
              : matchScore >= 40
              ? "linear-gradient(90deg, #f59e0b, #d97706)"
              : "linear-gradient(90deg, #f43f5e, #e11d48)",
          }}
        />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Company avatar */}
          <div className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-xs",
            getCompanyColor(job.company)
          )}>
            {companyInitial(job.company)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-indigo-700 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {job.company}
            </p>
          </div>

          {/* Source badge */}
          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0", src.color)}>
            {src.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
          {job.location && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              {job.location}
            </span>
          )}
          {job.remote && (
            <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md">
              <Wifi className="w-3 h-3" />
              Remote
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <DollarSign className="w-3 h-3 text-slate-400" />
              {salary}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {timeAgo(job.postedAt)}
          </span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
          {matchScore !== undefined && (
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", scoreColor)}>
              {matchScore}% match
            </span>
          )}
          <div className="flex gap-1.5 ml-auto">
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

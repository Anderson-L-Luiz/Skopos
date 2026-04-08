"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { DollarSign, Search, Loader2, TrendingUp, Database, Sparkles } from "lucide-react";

interface SalaryResult {
  role: string;
  location: string;
  fromJobs: { salaryMin: number; salaryMedian: number; salaryMax: number; dataPoints: number } | null;
  aiEstimate: { salaryMin: number; salaryMedian: number; salaryMax: number } | null;
  combined: { salaryMin: number; salaryMedian: number; salaryMax: number } | null;
  jobSamples: { title: string; company: string; location: string; min: number; max: number }[];
}

function formatSalary(n: number) {
  return `$${(n / 1000).toFixed(0)}k`;
}

export default function SalaryPage() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ role });
      if (location) params.set("location", location);
      if (experience) params.set("experience", experience);
      const res = await fetch(`/api/salary?${params}`);
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Salary Insights" subtitle="Compare salary ranges by role, location, and experience" />

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role Title</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <div className="w-44">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Years Exp</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>
          <button
            onClick={search}
            disabled={!role || loading}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white gradient-primary disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Combined Range */}
          {result.combined && (
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-bold">Salary Range for &quot;{result.role}&quot;</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-white/70 text-xs mb-1">Minimum</div>
                  <div className="text-2xl font-black">{formatSalary(result.combined.salaryMin)}</div>
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">Median</div>
                  <div className="text-2xl font-black">{formatSalary(result.combined.salaryMedian)}</div>
                </div>
                <div>
                  <div className="text-white/70 text-xs mb-1">Maximum</div>
                  <div className="text-2xl font-black">{formatSalary(result.combined.salaryMax)}</div>
                </div>
              </div>
              {/* Visual bar */}
              <div className="mt-4 h-3 bg-white/20 rounded-full relative">
                <div
                  className="absolute h-full bg-white/80 rounded-full"
                  style={{
                    left: "0%",
                    width: "100%",
                  }}
                />
                <div
                  className="absolute h-full w-1 bg-yellow-300 rounded-full"
                  style={{ left: `${((result.combined.salaryMedian - result.combined.salaryMin) / (result.combined.salaryMax - result.combined.salaryMin)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.fromJobs && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">From Job Listings ({result.fromJobs.dataPoints} data points)</h4>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Min: {formatSalary(result.fromJobs.salaryMin)}</div>
                  <div>Median: {formatSalary(result.fromJobs.salaryMedian)}</div>
                  <div>Max: {formatSalary(result.fromJobs.salaryMax)}</div>
                </div>
              </div>
            )}
            {result.aiEstimate && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">AI Market Estimate</h4>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Min: {formatSalary(result.aiEstimate.salaryMin)}</div>
                  <div>Median: {formatSalary(result.aiEstimate.salaryMedian)}</div>
                  <div>Max: {formatSalary(result.aiEstimate.salaryMax)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Job Samples */}
          {result.jobSamples?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Sample Job Listings</h4>
              <div className="space-y-2">
                {result.jobSamples.map((j, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{j.title} at {j.company}</span>
                    <span className="text-slate-500 font-medium">
                      {j.min && j.max ? `${formatSalary(j.min)} - ${formatSalary(j.max)}` : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!result.combined && !result.fromJobs && !result.aiEstimate && (
            <div className="text-center py-12 text-slate-500">
              No salary data found for &quot;{result.role}&quot;. Try a different role title.
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-16 text-slate-500">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          Search for a role to see salary insights.
        </div>
      )}
    </div>
  );
}

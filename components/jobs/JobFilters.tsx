"use client";
import { Search, X } from "lucide-react";

export interface JobFilterValues {
  search: string;
  source: string;
  remote: string;
  minSalary: string;
}

interface JobFiltersProps {
  onFilterChange: (filters: JobFilterValues) => void;
  filters: JobFilterValues;
}

const hasActiveFilters = (f: JobFilterValues) =>
  f.search !== "" || f.source !== "all" || f.remote !== "all" || f.minSalary !== "0";

export function JobFilters({ onFilterChange, filters }: JobFiltersProps) {
  const update = (key: keyof JobFilterValues, value: string) =>
    onFilterChange({ ...filters, [key]: value });

  const reset = () =>
    onFilterChange({ search: "", source: "all", remote: "all", minSalary: "0" });

  const selectClass = "h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none cursor-pointer transition-all";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="w-full pl-10 pr-4 h-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => update("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source */}
        <div className="relative">
          <select
            value={filters.source}
            onChange={(e) => update("source", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="indeed">Indeed</option>
            <option value="glassdoor">Glassdoor</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Remote */}
        <div className="relative">
          <select
            value={filters.remote}
            onChange={(e) => update("remote", e.target.value)}
            className={selectClass}
          >
            <option value="all">Any Location</option>
            <option value="remote">Remote Only</option>
            <option value="onsite">On-Site Only</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Salary */}
        <div className="relative">
          <select
            value={filters.minSalary}
            onChange={(e) => update("minSalary", e.target.value)}
            className={selectClass}
          >
            <option value="0">Any Salary</option>
            <option value="100000">$100k+</option>
            <option value="130000">$130k+</option>
            <option value="150000">$150k+</option>
            <option value="200000">$200k+</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters(filters) && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

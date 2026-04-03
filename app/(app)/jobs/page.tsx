"use client";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters, type JobFilterValues } from "@/components/jobs/JobFilters";
import { Loader2, RefreshCw, ChevronLeft, ChevronRight, Briefcase, Search } from "lucide-react";
import type { JobListing } from "@/types";

interface JobsResponse {
  jobs: JobListing[];
  total: number;
  page: number;
  pages: number;
}

export default function JobsPage() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [scraping, setScraping] = useState(false);
  const [filters, setFilters] = useState<JobFilterValues>({
    search: "",
    source: "all",
    remote: "all",
    minSalary: "0",
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search: filters.search,
      source: filters.source,
      remote: filters.remote,
      minSalary: filters.minSalary,
      page: String(page),
      limit: "18",
    });
    const res = await fetch(`/api/jobs?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [filters, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleScrape = async () => {
    setScraping(true);
    await fetch("/api/jobs/scrape", { method: "POST" });
    await fetchJobs();
    setScraping(false);
  };

  const handleFilterChange = (f: JobFilterValues) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Job Listings"
        subtitle={data ? `${data.total} positions available` : "Loading..."}
        actions={
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 transition-colors"
          >
            {scraping
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing...</>
              : <><RefreshCw className="w-3.5 h-3.5" /> Refresh Jobs</>
            }
          </button>
        }
      />

      <div className="flex-1 p-6 space-y-5 overflow-auto">
        {/* Filters */}
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading job listings...</p>
          </div>
        ) : data?.jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              {filters.search ? (
                <Search className="w-7 h-7 text-slate-400" />
              ) : (
                <Briefcase className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-800 mb-1">
                {filters.search ? "No results found" : "No jobs loaded yet"}
              </p>
              <p className="text-sm text-slate-400">
                {filters.search
                  ? `No jobs matching "${filters.search}". Try different filters.`
                  : "Click 'Refresh Jobs' to load the latest job listings."
                }
              </p>
            </div>
            {!filters.search && (
              <button
                onClick={handleScrape}
                disabled={scraping}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white gradient-primary shadow-glow hover:opacity-90 disabled:opacity-60 transition-all"
              >
                {scraping
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                  : <><RefreshCw className="w-4 h-4" /> Load Job Listings</>
                }
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data?.jobs.map((job, i) => (
                <div
                  key={job.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.3)}s`, opacity: 0 }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                        p === page
                          ? "gradient-primary text-white shadow-glow"
                          : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={page === data.pages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

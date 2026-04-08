"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { FileText, Loader2, Copy, Check, Trash2, Plus } from "lucide-react";

interface CoverLetterItem {
  id: string;
  content: string;
  tone: string;
  createdAt: string;
  job?: { title: string; company: string };
}

export default function CoverLettersPage() {
  const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [tone, setTone] = useState("professional");
  const [jobs, setJobs] = useState<{ id: string; title: string; company: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/cover-letter").then((r) => r.json()),
      fetch("/api/jobs?limit=50").then((r) => r.json()),
    ]).then(([clData, jobData]) => {
      setCoverLetters(clData.coverLetters || []);
      setJobs(jobData.jobs || []);
      setLoading(false);
    });
  }, []);

  const generate = async () => {
    if (!selectedJob) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob, tone }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoverLetters((prev) => [data, ...prev]);
        setExpandedId(data.id);
      } else {
        alert(data.error || "Failed to generate. Ensure an AI provider is configured.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteCoverLetter = async (id: string) => {
    await fetch(`/api/cover-letter/${id}`, { method: "DELETE" });
    setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div>
      <Header title="Cover Letters" subtitle="AI-generated cover letters tailored to each job" />

      {/* Generator */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-500" />
          Generate New Cover Letter
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="">Choose a job...</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title} at {j.company}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="professional">Professional</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="concise">Concise</option>
            </select>
          </div>
          <button
            onClick={generate}
            disabled={!selectedJob || generating}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white gradient-primary disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate</>}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {coverLetters.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No cover letters yet. Select a job and generate one above.
          </div>
        )}
        {coverLetters.map((cl) => (
          <div key={cl.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {cl.job?.title} at {cl.job?.company}
                </h4>
                <p className="text-xs text-slate-500">
                  {new Date(cl.createdAt).toLocaleDateString()} · {cl.tone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(cl.id, cl.content)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                  title="Copy to clipboard"
                >
                  {copied === cl.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteCoverLetter(cl.id)}
                  className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-500 hover:text-rose-500"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              className={`text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed ${expandedId === cl.id ? "" : "line-clamp-4"}`}
              onClick={() => setExpandedId(expandedId === cl.id ? null : cl.id)}
            >
              {cl.content}
            </div>
            {expandedId !== cl.id && (
              <button onClick={() => setExpandedId(cl.id)} className="text-xs text-indigo-500 mt-2 hover:underline">
                Show full letter
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

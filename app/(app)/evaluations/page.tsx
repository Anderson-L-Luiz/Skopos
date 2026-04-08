"use client";
import { useEffect, useState } from "react";

interface Job { id: string; title: string; company: string; }
interface Dim { name: string; weight: number; score: number; rationale: string; }
interface Report {
  grade: string;
  overallScore: number;
  dimensions: Dim[];
  roleSummary: string; cvMatch: string; levelStrategy: string;
  compResearch: string; personalization: string; interviewPrep: string;
  job?: Job;
}

const gradeColor: Record<string, string> = {
  A: "bg-emerald-500", B: "bg-sky-500", C: "bg-amber-500", D: "bg-orange-500", F: "bg-rose-500",
};

export default function EvaluationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/jobs").then((r) => r.json()).then((d) => {
      const list: Job[] = Array.isArray(d) ? d : d.jobs || [];
      setJobs(list);
      if (list[0]) setSelected(list[0].id);
    }).catch(() => {});
  }, []);

  async function runEvaluation() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/evaluations/${selected}`, { method: "POST" });
      const data = await res.json();
      setReport(data);
    } finally { setLoading(false); }
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">Job Evaluation</h1>
      <p className="text-slate-500 mb-6">A–F grade with 10 weighted dimensions and a 6-block report.</p>

      <div className="flex gap-3 mb-6">
        <select
          data-testid="job-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white flex-1"
        >
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} — {j.company}</option>)}
        </select>
        <button
          data-testid="run-eval"
          onClick={runEvaluation}
          disabled={!selected || loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm disabled:opacity-50"
        >
          {loading ? "Evaluating..." : "Run Evaluation"}
        </button>
      </div>

      {report && (
        <div data-testid="eval-report" className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100">
            <div data-testid="grade" className={`w-20 h-20 rounded-2xl ${gradeColor[report.grade]} text-white text-5xl font-black flex items-center justify-center`}>
              {report.grade}
            </div>
            <div>
              <div className="text-sm text-slate-500">Overall score</div>
              <div data-testid="overall-score" className="text-4xl font-black">{report.overallScore}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold mb-3">Weighted Dimensions</h2>
            <div className="space-y-2">
              {report.dimensions.map((d) => (
                <div key={d.name} className="flex items-center gap-3 text-sm">
                  <div className="w-44 font-medium">{d.name}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${d.score}%` }} />
                  </div>
                  <div className="w-10 text-right tabular-nums">{d.score}</div>
                  <div className="w-12 text-right text-slate-400 text-xs">{Math.round(d.weight * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          {[
            ["Role Summary", report.roleSummary],
            ["CV Match", report.cvMatch],
            ["Level Strategy", report.levelStrategy],
            ["Compensation Research", report.compResearch],
            ["Personalization", report.personalization],
            ["Interview Prep", report.interviewPrep],
          ].map(([title, body]) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

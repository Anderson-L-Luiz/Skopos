"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Loader2, Trash2, ChevronDown, Plus, X } from "lucide-react";
import type { Application } from "@/types";

const STATUS_CONFIG = {
  saved: { label: "Saved", color: "bg-slate-50 border-slate-200", badge: "text-slate-700 bg-slate-100" },
  applied: { label: "Applied", color: "bg-blue-50 border-blue-200", badge: "text-blue-700 bg-blue-100" },
  interviewing: { label: "Interviewing", color: "bg-amber-50 border-amber-200", badge: "text-amber-700 bg-amber-100" },
  offered: { label: "Offered", color: "bg-emerald-50 border-emerald-200", badge: "text-emerald-700 bg-emerald-100" },
  rejected: { label: "Rejected", color: "bg-rose-50 border-rose-200", badge: "text-rose-700 bg-rose-100" },
};

const STATUS_ORDER = ["saved", "applied", "interviewing", "offered", "rejected"] as const;

interface ApplicationWithJob {
  id: string;
  userId: string;
  jobId: string;
  status: "saved" | "applied" | "interviewing" | "offered" | "rejected";
  notes?: string | null;
  appliedAt?: Date | null;
  createdAt: Date;
  job: {
    id: string;
    title: string;
    company: string;
    skills: string[];
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [showNoteInput, setShowNoteInput] = useState<Record<string, boolean>>({});

  const fetchApplications = async () => {
    setLoading(true);
    const res = await fetch("/api/applications");
    if (res.ok) setApplications(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const res = await fetch(`/api/applications/${appId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setApplications((apps) =>
        apps.map((a) => (a.id === appId ? { ...a, status: newStatus as "saved" | "applied" | "interviewing" | "offered" | "rejected" } : a))
      );
    }
  };

  const handleUpdateNotes = async (appId: string) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: editingNotes[appId] || "" }),
    });

    if (res.ok) {
      setApplications((apps) =>
        apps.map((a) =>
          a.id === appId ? { ...a, notes: editingNotes[appId] } : a
        )
      );
      setShowNoteInput((prev) => ({ ...prev, [appId]: false }));
      setEditingNotes((prev) => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to remove this application?")) return;

    const res = await fetch(`/api/applications/${appId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setApplications((apps) => apps.filter((a) => a.id !== appId));
    }
  };

  const groupedByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status);
    return acc;
  }, {} as Record<string, ApplicationWithJob[]>);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Application Tracker"
        subtitle={`${applications.length} applications tracked`}
      />

      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Plus className="w-7 h-7 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-800 mb-1">No applications yet</p>
              <p className="text-sm text-slate-400">Start tracking job applications to see them here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {STATUS_ORDER.map((status) => {
              const apps = groupedByStatus[status];
              const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

              return (
                <div key={status} className="flex flex-col gap-3">
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900">{config.label}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{apps.length} {apps.length === 1 ? "app" : "apps"}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${config.badge}`}>
                      {apps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3 min-h-96">
                    {apps.map((app, i) => (
                      <div
                        key={app.id}
                        className={`p-4 rounded-xl border shadow-card hover:shadow-card-md transition-all animate-slide-up group cursor-pointer ${config.color}`}
                        style={{ animationDelay: `${Math.min(i * 0.05, 0.2)}s`, opacity: 0 }}
                      >
                        {/* Job Info */}
                        <div className="mb-3">
                          <h4 className="font-bold text-sm text-slate-900 leading-tight mb-0.5 line-clamp-2">
                            {app.job.title}
                          </h4>
                          <p className="text-xs text-slate-600">{app.job.company}</p>
                        </div>

                        {/* Date applied */}
                        {app.appliedAt && (
                          <p className="text-xs text-slate-500 mb-3">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        )}

                        {/* Notes section */}
                        <div className="mb-3">
                          {showNoteInput[app.id] ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingNotes[app.id] ?? app.notes ?? ""}
                                onChange={(e) =>
                                  setEditingNotes((prev) => ({
                                    ...prev,
                                    [app.id]: e.target.value,
                                  }))
                                }
                                placeholder="Add notes..."
                                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateNotes(app.id)}
                                  className="flex-1 px-2 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setShowNoteInput((prev) => ({
                                      ...prev,
                                      [app.id]: false,
                                    }));
                                    setEditingNotes((prev) => {
                                      const next = { ...prev };
                                      delete next[app.id];
                                      return next;
                                    });
                                  }}
                                  className="flex-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : app.notes ? (
                            <div
                              className="p-2 rounded-lg bg-white/50 border border-slate-200/50"
                              onClick={() => {
                                setShowNoteInput((prev) => ({ ...prev, [app.id]: true }));
                                setEditingNotes((prev) => ({
                                  ...prev,
                                  [app.id]: app.notes || "",
                                }));
                              }}
                            >
                              <p className="text-xs text-slate-600 line-clamp-2 cursor-pointer">
                                {app.notes}
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setShowNoteInput((prev) => ({ ...prev, [app.id]: true }));
                                setEditingNotes((prev) => ({ ...prev, [app.id]: "" }));
                              }}
                              className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                            >
                              + Add notes
                            </button>
                          )}
                        </div>

                        {/* Status dropdown */}
                        <div className="relative mb-3">
                          <button className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <span>Move to...</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-card-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-1">
                            {STATUS_ORDER.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(app.id, s)}
                                disabled={s === app.status}
                                className={`w-full px-3 py-1.5 text-xs font-medium text-left hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                                  s === app.status ? "text-indigo-600 font-bold" : "text-slate-700"
                                }`}
                              >
                                {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

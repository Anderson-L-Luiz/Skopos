"use client";
import { useState } from "react";
import { Loader2, Bookmark, Check } from "lucide-react";

interface TrackApplicationButtonProps {
  jobId: string;
  onSuccess?: () => void;
  variant?: "default" | "compact";
}

export function TrackApplicationButton({
  jobId,
  onSuccess,
  variant = "default",
}: TrackApplicationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (tracked || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          status: "saved",
          notes: "",
        }),
      });

      if (res.status === 409) {
        setError("Already tracking this job");
        return;
      }

      if (res.ok) {
        setTracked(true);
        onSuccess?.();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to track application");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleTrack}
        disabled={tracked || loading}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          tracked
            ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        }`}
        title={tracked ? "Tracked" : "Track application"}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : tracked ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Bookmark className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleTrack}
      disabled={tracked || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        tracked
          ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
          : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
      } disabled:opacity-60`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Tracking...
        </>
      ) : tracked ? (
        <>
          <Check className="w-4 h-4" />
          Tracked
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Track Application
        </>
      )}
    </button>
  );
}

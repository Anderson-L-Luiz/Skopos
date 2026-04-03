"use client";
import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CVUploaderProps {
  onUpload: (filename: string) => void;
  currentFile?: string | null;
}

export function CVUploader({ onUpload, currentFile }: CVUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cv/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.filename) {
        setUploaded(data.filename);
        onUpload(data.filename);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group",
          dragging
            ? "border-indigo-400 bg-indigo-50/50"
            : uploaded
            ? "border-emerald-300 bg-emerald-50/30 hover:border-emerald-400"
            : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/20",
          uploading && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        <div className="p-8 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Uploading your CV...</p>
                <p className="text-xs text-slate-400 mt-0.5">This will only take a moment</p>
              </div>
            </div>
          ) : uploaded ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">{uploaded}</span>
                </div>
                <p className="text-xs text-slate-400">CV uploaded · Click to replace</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors",
                dragging ? "bg-indigo-100 border-indigo-300" : "bg-white border-slate-300 group-hover:border-indigo-300 group-hover:bg-indigo-50"
              )}>
                <Upload className={cn("w-5 h-5 transition-colors", dragging ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500")} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {dragging ? "Drop your CV here" : "Drop your CV here or click to browse"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">PDF and DOCX files supported · Max 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-rose-600 font-medium">
          <X className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}

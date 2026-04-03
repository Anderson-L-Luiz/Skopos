"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { CVUploader } from "@/components/cv/CVUploader";
import { CVPreview } from "@/components/cv/CVPreview";
import { Loader2, Save, Sparkles, X, Plus, User, Link as LinkIcon, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

type TabKey = "edit" | "preview";

export default function CVPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("edit");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [form, setForm] = useState({
    headline: "",
    summary: "",
    currentRole: "",
    yearsExp: "",
    linkedinUrl: "",
    githubUrl: "",
    scholarUrl: "",
    twitterUrl: "",
    instagramUrl: "",
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await fetch("/api/cv");
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setForm({
        headline: data.headline || "",
        summary: data.summary || "",
        currentRole: data.currentRole || "",
        yearsExp: data.yearsExp?.toString() || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        scholarUrl: data.scholarUrl || "",
        twitterUrl: data.twitterUrl || "",
        instagramUrl: data.instagramUrl || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/cv", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills: profile?.skills || [] }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
    setSaving(false);
  };

  const handleEnrich = async () => {
    setEnriching(true);
    const res = await fetch("/api/cv/enrich", { method: "POST" });
    if (res.ok) setProfile(await res.json());
    setEnriching(false);
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="CV Builder" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="CV Builder"
        subtitle="Build and enrich your professional profile"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnrich}
              disabled={enriching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 disabled:opacity-60 transition-colors"
            >
              {enriching
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enriching...</>
                : <><Sparkles className="w-3.5 h-3.5" /> Enrich from Web</>
              }
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60 transition-all",
                savedSuccess
                  ? "bg-emerald-50 text-emerald-700"
                  : "gradient-primary text-white shadow-glow hover:opacity-90"
              )}
            >
              {saving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
              ) : savedSuccess ? (
                <>✓ Saved!</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> Save Profile</>
              )}
            </button>
          </div>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
          {[
            { key: "edit" as const, label: "Edit Profile", icon: User },
            { key: "preview" as const, label: "CV Preview", icon: Briefcase },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-card"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "edit" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* CV Upload */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Upload CV</h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload your existing CV to pre-fill your profile</p>
              </div>
              <CVUploader
                currentFile={profile?.cvFile}
                onUpload={(filename) => setProfile(prev => prev ? { ...prev, cvFile: filename } : prev)}
              />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Professional headline</label>
                  <input
                    placeholder="Senior Software Engineer at Acme Corp"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Current role</label>
                    <input
                      placeholder="Software Engineer"
                      value={form.currentRole}
                      onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Years of experience</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={form.yearsExp}
                      onChange={(e) => setForm({ ...form, yearsExp: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Professional summary</label>
                  <textarea
                    placeholder="Brief professional summary highlighting your experience and goals..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    rows={4}
                    className={cn(inputClass, "resize-none leading-relaxed")}
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Skills</h3>
                <p className="text-xs text-slate-400 mt-0.5">Add skills to improve your job match scoring</p>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  placeholder="Add a skill (e.g. React, Python, SQL)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className={cn(inputClass, "flex-1")}
                />
                <button
                  onClick={addSkill}
                  className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-glow hover:opacity-90 transition-opacity shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-12">
                {(profile?.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 hover:text-indigo-900 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(!profile?.skills || profile.skills.length === 0) && (
                  <p className="text-sm text-slate-400">No skills added yet. Add skills to get AI match scoring.</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Online Presence</h3>
                <p className="text-xs text-slate-400 mt-0.5">Add profile URLs for web enrichment and brand analysis</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: "linkedinUrl", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", color: "text-sky-500" },
                  { key: "githubUrl", label: "GitHub", placeholder: "https://github.com/username", color: "text-slate-700" },
                  { key: "scholarUrl", label: "Google Scholar", placeholder: "https://scholar.google.com/citations?user=...", color: "text-blue-600" },
                  { key: "twitterUrl", label: "X (Twitter)", placeholder: "https://twitter.com/username", color: "text-slate-800" },
                  { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/username", color: "text-pink-500" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className={labelClass}>
                      <span className={field.color}>{field.label}</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className={cn(inputClass, "pl-9")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          profile ? (
            <CVPreview profile={profile} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Briefcase className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">Fill in your profile to see the CV preview.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

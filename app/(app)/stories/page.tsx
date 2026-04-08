"use client";
import { useEffect, useState } from "react";

interface Story {
  id: string; title: string; situation: string; task: string;
  action: string; result: string; reflection?: string | null; tags: string[];
}

const empty = { title: "", situation: "", task: "", action: "", result: "", reflection: "" };

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await fetch("/api/stories");
    if (r.ok) setStories(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) { setForm(empty); await load(); }
    } finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">Interview Story Bank</h1>
      <p className="text-slate-500 mb-6">Build a reusable library of STAR + Reflection narratives.</p>

      <form onSubmit={save} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-3 mb-8">
        {(["title", "situation", "task", "action", "result", "reflection"] as const).map((k) => (
          <div key={k}>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">{k}</label>
            {k === "title" ? (
              <input
                data-testid={`story-${k}`}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                required
              />
            ) : (
              <textarea
                data-testid={`story-${k}`}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                required={k !== "reflection"}
              />
            )}
          </div>
        ))}
        <button
          data-testid="story-save"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save story"}
        </button>
      </form>

      <h2 className="font-bold mb-3">Saved stories ({stories.length})</h2>
      <ul data-testid="story-list" className="space-y-3">
        {stories.map((s) => (
          <li key={s.id} className="bg-white border border-slate-100 rounded-xl p-4">
            <div className="font-bold">{s.title}</div>
            <div className="text-xs text-slate-500 mt-1">S: {s.situation.slice(0, 80)}...</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

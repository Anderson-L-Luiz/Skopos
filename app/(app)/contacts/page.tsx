"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Users, Plus, Loader2, Mail, Phone, Linkedin, Building2, Calendar, Trash2, Edit3, X } from "lucide-react";

interface ContactItem {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  linkedinUrl?: string | null;
  relationship: string;
  notes?: string | null;
  followUpDate?: string | null;
  lastContactedAt?: string | null;
  createdAt: string;
}

const RELATIONSHIPS = [
  { value: "recruiter", label: "Recruiter" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "referral", label: "Referral" },
  { value: "colleague", label: "Colleague" },
  { value: "other", label: "Other" },
];

const REL_COLORS: Record<string, string> = {
  recruiter: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  hiring_manager: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  referral: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  colleague: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", role: "", linkedinUrl: "", relationship: "other", notes: "", followUpDate: "" });
  const [saving, setSaving] = useState(false);
  const [filterRel, setFilterRel] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => { setContacts(d.contacts || []); setLoading(false); });
  }, []);

  const addContact = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setContacts((prev) => [data, ...prev]);
        setForm({ name: "", email: "", phone: "", company: "", role: "", linkedinUrl: "", relationship: "other", notes: "", followUpDate: "" });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = filterRel ? contacts.filter((c) => c.relationship === filterRel) : contacts;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div>
      <Header
        title="Contacts"
        subtitle="Track your professional network and follow-ups"
      />

      {/* Actions bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <select
            value={filterRel}
            onChange={(e) => setFilterRel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
          >
            <option value="">All Relationships</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <span className="text-sm text-slate-500">{filtered.length} contacts</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white gradient-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Contact"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">New Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <input placeholder="Role / Title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <input placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <select value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              {RELATIONSHIPS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <input type="date" placeholder="Follow-up Date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" rows={2} />
          </div>
          <button onClick={addContact} disabled={!form.name || saving} className="mt-4 px-6 py-2 rounded-xl text-sm font-bold text-white gradient-primary disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Contact
          </button>
        </div>
      )}

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-card transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {c.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                  {c.role && <p className="text-xs text-slate-500">{c.role}</p>}
                </div>
              </div>
              <button onClick={() => deleteContact(c.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${REL_COLORS[c.relationship] || REL_COLORS.other}`}>
              {RELATIONSHIPS.find((r) => r.value === c.relationship)?.label || c.relationship}
            </span>

            <div className="space-y-1.5 text-xs text-slate-500">
              {c.company && <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {c.company}</div>}
              {c.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {c.email}</div>}
              {c.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {c.phone}</div>}
              {c.linkedinUrl && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" /> <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">LinkedIn</a></div>}
              {c.followUpDate && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Calendar className="w-3 h-3" /> Follow up: {new Date(c.followUpDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {c.notes && <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{c.notes}</p>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          No contacts yet. Add your first contact above.
        </div>
      )}
    </div>
  );
}

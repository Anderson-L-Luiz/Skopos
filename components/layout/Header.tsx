"use client";
import { useSession } from "next-auth/react";
import { Bell, Moon, Sun, Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  const notifications = [
    { id: 1, text: "3 new jobs match your profile", time: "2m ago", dot: "bg-indigo-500" },
    { id: 2, text: "Your CV was successfully enriched", time: "1h ago", dot: "bg-emerald-500" },
    { id: 3, text: "Brand score updated: +8 points", time: "3h ago", dot: "bg-amber-500" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      {/* Left: title */}
      <div>
        <h1 className="text-base font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium leading-none mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Custom actions slot */}
        {actions && <div className="mr-2">{actions}</div>}

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-card-xl z-50 overflow-hidden animate-scale-in">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${n.dot} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">{n.text}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-400 font-medium">View all notifications</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 ml-1.5 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 leading-none">
              {session?.user?.name?.split(" ")[0] ?? "User"}
            </div>
            <div className="text-[11px] text-slate-400 leading-none mt-0.5">Free plan</div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

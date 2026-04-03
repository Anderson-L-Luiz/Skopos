"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Briefcase, FileText, Target, Star, GraduationCap, LogOut,
  ChevronRight, Sparkles
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview" },
  { href: "/jobs", label: "Jobs", icon: Briefcase, description: "Browse listings", badge: "65" },
  { href: "/cv", label: "CV Builder", icon: FileText, description: "Build & enrich" },
  { href: "/matches", label: "Matches", icon: Target, description: "Scored for you" },
  { href: "/brand", label: "Brand Advisor", icon: Star, description: "Online presence" },
  { href: "/interview", label: "Interview Prep", icon: GraduationCap, description: "Get prepared" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-100 flex flex-col z-40 shadow-[1px_0_0_0_rgb(226,232,240)]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <div>
            <div className="font-black text-slate-900 text-base tracking-tight leading-none">Skopos</div>
            <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Career Platform</div>
          </div>
        </Link>
      </div>

      {/* AI badge */}
      <div className="mx-4 mt-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span className="text-xs font-semibold text-indigo-700">AI-powered matching active</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="section-label mb-3">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-item group", isActive && "active")}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                isActive
                  ? "bg-indigo-100"
                  : "bg-slate-100 group-hover:bg-slate-200"
              )}>
                <Icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-500")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold leading-none mb-0.5">{item.label}</div>
                <div className="text-[11px] text-slate-400 font-normal">{item.description}</div>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-semibold tabular">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-100 p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate leading-none mb-0.5">
              {session?.user?.name ?? "User"}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {session?.user?.email ?? ""}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-item w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

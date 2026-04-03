import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "amber" | "violet" | "rose" | "indigo" | "cyan";
}

const colorConfig = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "from-blue-500 to-blue-600",
    border: "border-blue-100",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-500 to-emerald-600",
    border: "border-emerald-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    accent: "from-amber-500 to-amber-600",
    border: "border-amber-100",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    accent: "from-violet-500 to-violet-600",
    border: "border-violet-100",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    accent: "from-rose-500 to-rose-600",
    border: "border-rose-100",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    accent: "from-indigo-500 to-indigo-600",
    border: "border-indigo-100",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    accent: "from-cyan-500 to-cyan-600",
    border: "border-cyan-100",
  },
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const cfg = colorConfig[color];
  const isPositive = trend ? trend.value >= 0 : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</p>
          <p className="text-3xl font-black text-slate-900 tabular leading-none mb-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold",
              isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {isPositive ? "+" : ""}{trend.value}% {trend.label}
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ml-4 transition-transform group-hover:scale-110",
          cfg.icon
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

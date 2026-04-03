"use client";

import { Calendar, Linkedin, Twitter, Github, BookOpen, Clock, Tag } from "lucide-react";
import type { ContentCalendar as ContentCalendarType } from "@/types";

interface ContentCalendarProps {
  calendar: ContentCalendarType;
}

function getPlatformColor(
  platform: string
): { bg: string; border: string; text: string; icon: React.ReactNode } {
  switch (platform) {
    case "LinkedIn":
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: <Linkedin className="w-4 h-4" />,
      };
    case "Twitter":
      return {
        bg: "bg-sky-50",
        border: "border-sky-200",
        text: "text-sky-700",
        icon: <Twitter className="w-4 h-4" />,
      };
    case "GitHub":
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        icon: <Github className="w-4 h-4" />,
      };
    case "Blog":
      return {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        icon: <BookOpen className="w-4 h-4" />,
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        icon: <Calendar className="w-4 h-4" />,
      };
  }
}

function getContentTypeBadge(contentType: string): { bg: string; text: string; label: string } {
  switch (contentType) {
    case "post":
      return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Post" };
    case "article":
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Article" };
    case "code":
      return { bg: "bg-orange-100", text: "text-orange-700", label: "Code" };
    case "thread":
      return { bg: "bg-purple-100", text: "text-purple-700", label: "Thread" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", label: "Content" };
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ContentCalendar({ calendar }: ContentCalendarProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">4-Week Content Calendar</h3>
          <p className="text-xs text-slate-500">
            Personalized posting schedule based on your brand analysis
          </p>
        </div>
      </div>

      {/* Weeks grid */}
      <div className="space-y-5">
        {calendar.weeks.map((week) => (
          <div key={week.week} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            {/* Week header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Week {week.week}</h4>
                  <p className="text-xs text-slate-500">
                    {formatDate(week.startDate)} — {formatDate(new Date(week.startDate.getTime() + 4 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {week.items.map((item) => {
                    const color = getPlatformColor(item.platform);
                    return (
                      <div
                        key={item.day}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center ${color.bg} ${color.border} ${color.text}`}
                        title={item.platform}
                      >
                        {color.icon}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content items */}
            <div className="divide-y divide-slate-100">
              {week.items.map((item) => {
                const platformColor = getPlatformColor(item.platform);
                const typeColor = getContentTypeBadge(item.contentType);

                return (
                  <div
                    key={item.day}
                    className="p-5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Day and platform */}
                      <div className="shrink-0 min-w-fit">
                        <div className="text-xs font-bold text-slate-600 mb-2">{item.day}</div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${platformColor.bg} ${platformColor.border}`}
                        >
                          <span className={platformColor.text}>{platformColor.icon}</span>
                          <span className={`text-xs font-semibold ${platformColor.text}`}>
                            {item.platform}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h5 className="font-semibold text-slate-900 text-sm leading-snug">
                            {item.topic}
                          </h5>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${typeColor.bg} ${typeColor.text}`}
                          >
                            {typeColor.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {item.description}
                        </p>

                        {/* Time and hashtags */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{item.bestTimeToPost}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-slate-400" />
                              <div className="flex flex-wrap gap-1">
                                {item.hashtags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.hashtags.length > 2 && (
                                  <span className="text-xs text-slate-400">
                                    +{item.hashtags.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-5">
        <h4 className="text-sm font-bold text-blue-900 mb-3">Content Calendar Tips</h4>
        <ul className="space-y-2 text-xs text-blue-800">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>
              Schedule posts in advance using native platform schedulers or tools like Buffer or Later
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>
              Engage with comments in the first hour after posting to boost algorithmic reach
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>Customize hashtags based on current trends and your audience interests</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>Mix promotional content with valuable insights (80/20 rule)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

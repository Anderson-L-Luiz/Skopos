"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Loader2, ChevronDown, ChevronUp, ArrowRight, GraduationCap, TrendingUp, DollarSign, ExternalLink, BookOpen, Clock } from "lucide-react";
import type { InterviewQuestion, CareerPathStep } from "@/types";
import type { CourseRecommendation } from "@/lib/career/courseRecommender";
import { cn } from "@/lib/utils";

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium", color: "bg-amber-50 text-amber-700 border-amber-200" },
  hard: { label: "Hard", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  behavioral: { label: "Behavioral", color: "bg-violet-50 text-violet-700" },
  technical: { label: "Technical", color: "bg-blue-50 text-blue-700" },
  company: { label: "Company Fit", color: "bg-indigo-50 text-indigo-700" },
  coding: { label: "Coding", color: "bg-cyan-50 text-cyan-700" },
};

export default function InterviewPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [careerPath, setCareerPath] = useState<{
    currentRole: string;
    targetRole: string;
    path: CareerPathStep[];
    estimatedYears: number;
  } | null>(null);
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [loadingPath, setLoadingPath] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "career" | "courses">("questions");

  useEffect(() => {
    fetchQuestions();
    fetchCareerPath();
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty, selectedJobId]);

  useEffect(() => {
    if (activeTab === "courses") {
      fetchCoursesForMissingSkills();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchQuestions = async () => {
    setLoadingQ(true);
    const params = new URLSearchParams({ category, difficulty });
    if (selectedJobId) {
      params.append("jobId", selectedJobId);
    }
    const res = await fetch(`/api/interview/questions?${params}`);
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions);
    }
    setLoadingQ(false);
  };

  const fetchCareerPath = async () => {
    setLoadingPath(true);
    const res = await fetch("/api/career/path");
    if (res.ok) setCareerPath(await res.json());
    setLoadingPath(false);
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/matches");
      if (res.ok) {
        const data = await res.json();
        setJobs(data || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchCoursesForMissingSkills = async () => {
    setLoadingCourses(true);
    try {
      let missingSkills: string[] = [];

      // Get missing skills from selected job or all matches
      if (selectedJobId && jobs.length > 0) {
        const job = jobs.find((j) => j.jobId === selectedJobId);
        if (job?.gapAnalysis?.missingSkills) {
          missingSkills = job.gapAnalysis.missingSkills;
        }
      } else if (jobs.length > 0) {
        // Aggregate missing skills from top matches
        const skillSet = new Set<string>();
        jobs.slice(0, 5).forEach((job) => {
          if (job.gapAnalysis?.missingSkills) {
            job.gapAnalysis.missingSkills.forEach((skill: string) => skillSet.add(skill));
          }
        });
        missingSkills = Array.from(skillSet);
      }

      if (missingSkills.length > 0) {
        const params = new URLSearchParams({
          skills: missingSkills.join(","),
        });
        const res = await fetch(`/api/career/courses?${params}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data.recommendations || []);
        }
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const selectClass = "h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none cursor-pointer transition-all";

  return (
    <div className="flex flex-col h-full">
      <Header title="Interview Prep" subtitle="Practice questions and career trajectory planning" />

      <div className="flex-1 p-6 overflow-auto">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
          {[
            { key: "questions" as const, label: "Interview Questions", icon: GraduationCap },
            { key: "career" as const, label: "Career Path", icon: TrendingUp },
            { key: "courses" as const, label: "Skill Courses", icon: BookOpen },
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

        {/* Interview Questions tab */}
        {activeTab === "questions" && (
          <div className="space-y-4 max-w-3xl">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-slate-100 shadow-card p-4">
              <div className="relative">
                <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} className={selectClass}>
                  <option value="">All Roles</option>
                  {jobs.map((job) => (
                    <option key={job.jobId} value={job.jobId}>
                      {job.job.title} @ {job.job.company}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  <option value="all">All Categories</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="company">Company Fit</option>
                  <option value="coding">Coding</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="relative">
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <span className="text-sm font-semibold text-slate-500 ml-auto">
                {questions.length} questions
              </span>
            </div>

            {loadingQ ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q, i) => {
                  const isExpanded = expandedQ === q.id;
                  const diff = difficultyConfig[q.difficulty as keyof typeof difficultyConfig] ?? { label: q.difficulty, color: "bg-slate-50 text-slate-700 border-slate-200" };
                  const cat = categoryConfig[q.category] ?? { label: q.category, color: "bg-slate-50 text-slate-700" };

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden"
                    >
                      <button
                        className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50/50 transition-colors"
                        onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-slate-500">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md", cat.color)}>
                              {cat.label}
                            </span>
                            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md border", diff.color)}>
                              {diff.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.question}</p>
                        </div>
                        <div className="shrink-0 text-slate-400 mt-0.5">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && q.tips && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-9">
                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Interview Tips</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{q.tips}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Skill Courses tab */}
        {activeTab === "courses" && (
          <div className="max-w-3xl space-y-4">
            {loadingCourses ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Skill Gap Courses</p>
                  <p className="text-sm text-slate-600">Recommended courses to fill your skill gaps</p>
                </div>

                {courses.map((recommendation) => (
                  <div key={recommendation.skillName} className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
                    <div className="p-4 border-b border-slate-50">
                      <h3 className="font-semibold text-slate-900 capitalize">{recommendation.skillName}</h3>
                    </div>

                    <div className="divide-y divide-slate-50">
                      {recommendation.courses.map((course, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">{course.title}</h4>

                              <div className="flex items-center gap-2 flex-wrap mb-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                  {course.platform}
                                </span>
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                                    course.type === "free"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  )}
                                >
                                  {course.type === "free" ? "Free" : "Paid"}
                                </span>

                                {course.estimatedHours > 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {course.estimatedHours < 1
                                      ? `${Math.round(course.estimatedHours * 60)}m`
                                      : `${course.estimatedHours}h`}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 mb-3">
                                Learn at your own pace on {course.platform}
                              </p>
                            </div>

                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                              title="Open course"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <BookOpen className="w-10 h-10 text-slate-200" />
                <p className="text-sm text-slate-400">
                  No skill gaps identified. {jobs.length === 0 ? "Complete some job matches to see course recommendations." : "Great job - no missing skills!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Career Path tab */}
        {activeTab === "career" && (
          <div className="max-w-2xl">
            {loadingPath ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : careerPath ? (
              <div className="space-y-5">
                {/* Header card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Career Trajectory</p>
                      <h3 className="text-lg font-black text-slate-900">
                        {careerPath.currentRole}
                        <span className="text-slate-400 font-normal mx-2">→</span>
                        {careerPath.targetRole}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-700">{careerPath.estimatedYears}</div>
                      <div className="text-xs text-slate-400 font-medium">est. years</div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-300 via-violet-300 to-purple-300" />

                  <div className="space-y-4">
                    {/* Current */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 z-10 shadow-glow">
                        <span className="text-white font-black text-xs">NOW</span>
                      </div>
                      <div className="flex-1 bg-white rounded-xl border border-indigo-100 shadow-card p-4">
                        <p className="font-bold text-slate-900">{careerPath.currentRole}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Your current position</p>
                      </div>
                    </div>

                    {careerPath.path.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-300 flex items-center justify-center shrink-0 z-10">
                          <ArrowRight className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-card p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="font-bold text-slate-900">{step.role}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{step.timeframe}</p>
                            </div>
                            {step.salaryRange && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg shrink-0">
                                <DollarSign className="w-3 h-3" />
                                {step.salaryRange}
                              </span>
                            )}
                          </div>

                          {step.description && (
                            <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
                          )}

                          {step.skills && step.skills.length > 0 && (
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skills to develop</p>
                              <div className="flex flex-wrap gap-1.5">
                                {step.skills.map((s: string) => (
                                  <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Progress bar */}
                          <div className="mt-3 pt-3 border-t border-slate-50">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-primary rounded-full"
                                style={{ width: `${((i + 1) / careerPath.path.length) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>Step {i + 1}</span>
                              <span>{Math.round(((i + 1) / careerPath.path.length) * 100)}% of journey</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <TrendingUp className="w-10 h-10 text-slate-200" />
                <p className="text-sm text-slate-400">No career path available. Complete your profile first.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, ExternalLink, Wifi, ArrowLeft, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import type { JobListing, MatchResult } from "@/types";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) setJob(await res.json());
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const scoreJob = async () => {
    setScoring(true);
    const res = await fetch(`/api/matches/score/${id}`, { method: "POST" });
    if (res.ok) setMatch(await res.json());
    setScoring(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Job Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Job Details" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Job not found
        </div>
      </div>
    );
  }

  const skills = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills as unknown as string || "[]");

  return (
    <div className="flex flex-col h-full">
      <Header title="Job Details" />
      <div className="flex-1 p-6 overflow-auto max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.company}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                {job.remote && (
                  <span className="flex items-center gap-1">
                    <Wifi className="h-4 w-4" /> Remote
                  </span>
                )}
                {(job.salaryMin || job.salaryMax) && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${((job.salaryMin || 0) / 1000).toFixed(0)}k - ${((job.salaryMax || 0) / 1000).toFixed(0)}k
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="capitalize">{job.source}</Badge>
              {job.sourceUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-4 w-4" /> Apply
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Match Score */}
          {match ? (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">Match Score: {match.score}/100</p>
                    <Badge
                      variant={match.category === "open" ? "success" : match.category === "within_reach" ? "warning" : "secondary"}
                    >
                      {match.category.replace("_", " ")}
                    </Badge>
                  </div>
                  {match.gapAnalysis?.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Skills to develop:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.gapAnalysis.missingSkills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={scoreJob} disabled={scoring} variant="outline" className="w-full">
              {scoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
              Score This Job Against My Profile
            </Button>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Required Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader><CardTitle className="text-base">Job Description</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line">
                {job.description}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

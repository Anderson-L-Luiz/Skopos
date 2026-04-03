import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { UserProfile, EnrichedData } from "@/types";
import { Briefcase, GraduationCap, Code, Star, BookOpen, Github } from "lucide-react";

interface CVPreviewProps {
  profile: UserProfile;
}

export function CVPreview({ profile }: CVPreviewProps) {
  const enriched: EnrichedData | null = profile.enrichedData || null;
  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : JSON.parse(profile.skills as unknown as string || "[]");

  return (
    <div className="bg-white text-gray-900 p-8 rounded-lg border max-w-3xl font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{enriched?.linkedin?.name || "Your Name"}</h1>
        <p className="text-lg text-gray-600 mt-1">
          {profile.headline || enriched?.linkedin?.headline || profile.currentRole || "Professional Title"}
        </p>
        {profile.summary && (
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">{profile.summary}</p>
        )}
        {!profile.summary && enriched?.linkedin?.summary && (
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">{enriched.linkedin.summary}</p>
        )}
      </div>

      <Separator className="bg-gray-200 mb-6" />

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800 uppercase text-xs tracking-widest">Technical Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s: string) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {enriched?.linkedin?.experience && enriched.linkedin.experience.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800 uppercase text-xs tracking-widest">Experience</h2>
          </div>
          <div className="space-y-4">
            {enriched.linkedin.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {enriched?.linkedin?.education && enriched.linkedin.education.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800 uppercase text-xs tracking-widest">Education</h2>
          </div>
          {enriched.linkedin.education.map((edu, i) => (
            <div key={i} className="flex justify-between">
              <div>
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
              <span className="text-xs text-gray-500">{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* GitHub */}
      {enriched?.github && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Github className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800 uppercase text-xs tracking-widest">Open Source / GitHub</h2>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {enriched.github.repos} repositories · {enriched.github.stars} stars · {enriched.github.contributions} contributions
          </div>
          <div className="space-y-2">
            {enriched.github.topRepos?.map((repo, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-medium">{repo.name}</span>
                  {repo.description && <span className="text-xs text-gray-600 ml-2">{repo.description}</span>}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {enriched?.scholar && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-800 uppercase text-xs tracking-widest">Publications</h2>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {enriched.scholar.publications} publications · {enriched.scholar.citations} citations · h-index: {enriched.scholar.hIndex}
          </div>
        </div>
      )}
    </div>
  );
}

export interface JobListing {
  id: string;
  externalId?: string | null;
  title: string;
  company: string;
  location?: string | null;
  remote: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  description: string;
  skills: string[];
  source: string;
  sourceUrl?: string | null;
  trustScore: number;
  postedAt?: Date | null;
  scrapedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  headline?: string | null;
  summary?: string | null;
  currentRole?: string | null;
  yearsExp?: number | null;
  skills: string[];
  cvRaw?: string | null;
  cvFile?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  scholarUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  enrichedData?: EnrichedData | null;
  brandScore?: number | null;
}

export interface EnrichedData {
  linkedin?: LinkedInData;
  github?: GitHubData;
  scholar?: ScholarData;
}

export interface LinkedInData {
  name?: string;
  headline?: string;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  connections?: number;
}

export interface GitHubData {
  username?: string;
  repos?: number;
  stars?: number;
  languages?: string[];
  topRepos?: RepoItem[];
  contributions?: number;
}

export interface ScholarData {
  name?: string;
  institution?: string;
  publications?: number;
  citations?: number;
  hIndex?: number;
  papers?: PaperItem[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface RepoItem {
  name: string;
  description?: string;
  stars: number;
  language?: string;
}

export interface PaperItem {
  title: string;
  journal: string;
  year: number;
  citations: number;
}

export interface MatchResult {
  id: string;
  userId: string;
  jobId: string;
  job: JobListing;
  score: number;
  category: 'open' | 'within_reach' | 'stretch';
  gapAnalysis: GapAnalysis;
  createdAt: Date;
}

export interface GapAnalysis {
  missingSkills: string[];
  experienceGap?: string;
  salaryGap?: string;
  locationNote?: string;
  strengths: string[];
  recommendations: string[];
}

export interface BrandAnalysis {
  overallScore: number;
  breakdown: {
    profileCompleteness: number;
    contentFrequency: number;
    engagement: number;
    portfolioQuality: number;
  };
  recommendations: string[];
  contentStrategy: string[];
  portfolioSuggestions: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips?: string;
}

export interface CareerPathStep {
  role: string;
  timeframe: string;
  skills: string[];
  salaryRange: string;
  description: string;
}

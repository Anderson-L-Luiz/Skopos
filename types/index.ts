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

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  notes?: string | null;
  appliedAt?: Date | null;
  followUpDate?: Date | null;
  createdAt: Date;
  job?: JobListing;
  applicationNotes?: ApplicationNote[];
  tasks?: ApplicationTask[];
  contacts?: Contact[];
  coverLetters?: CoverLetter[];
}

export interface ApplicationNote {
  id: string;
  applicationId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationTask {
  id: string;
  applicationId: string;
  title: string;
  completed: boolean;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetter {
  id: string;
  userId: string;
  applicationId?: string | null;
  jobId: string;
  job?: JobListing;
  content: string;
  tone: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactRelationship = 'recruiter' | 'hiring_manager' | 'referral' | 'colleague' | 'other';

export interface Contact {
  id: string;
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  linkedinUrl?: string | null;
  relationship: ContactRelationship;
  notes?: string | null;
  applicationId?: string | null;
  followUpDate?: Date | null;
  lastContactedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryData {
  roleTitle: string;
  location?: string;
  experienceLevel?: string;
  salaryMin: number;
  salaryMedian: number;
  salaryMax: number;
  currency: string;
  dataPoints: number;
  source: 'database' | 'ai' | 'combined';
}

export type ContentPlatform = "LinkedIn" | "Twitter" | "GitHub" | "Blog";
export type ContentType = "post" | "article" | "code" | "thread";

export interface ContentItem {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  platform: ContentPlatform;
  contentType: ContentType;
  topic: string;
  description: string;
  hashtags: string[];
  bestTimeToPost: string;
}

export interface ContentWeek {
  week: number;
  startDate: Date;
  items: ContentItem[];
}

export interface ContentCalendar {
  weeks: ContentWeek[];
  generatedAt: Date;
  profile: {
    currentRole?: string | null;
    skills: string[];
    yearsExp?: number | null;
  };
}

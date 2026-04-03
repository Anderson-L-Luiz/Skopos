import type { BrandAnalysis, UserProfile } from "@/types";

export type Platform = "LinkedIn" | "Twitter" | "GitHub" | "Blog";
export type ContentType = "post" | "article" | "code" | "thread";

export interface ContentItem {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  platform: Platform;
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

// Topic suggestions based on weak areas in brand analysis
function getTopicsForWeakAreas(analysis: BrandAnalysis, skills: string[]): string[] {
  const topics: string[] = [];

  // Focus on areas with lowest scores
  const breakdown = analysis.breakdown;
  const scores = [
    { area: "profileCompleteness", score: breakdown.profileCompleteness },
    { area: "contentFrequency", score: breakdown.contentFrequency },
    { area: "engagement", score: breakdown.engagement },
    { area: "portfolioQuality", score: breakdown.portfolioQuality },
  ];

  const sortedByWeakness = scores.sort((a, b) => a.score - b.score);
  const weakestAreas = sortedByWeakness.slice(0, 2).map((s) => s.area);

  // Generate topics based on weakest areas
  if (weakestAreas.includes("contentFrequency")) {
    topics.push(`Technical insights: ${skills[0] || "development"} tips`);
    topics.push("Industry trend analysis");
    topics.push("Lessons learned from recent project");
    topics.push("Common mistakes in my field");
  }

  if (weakestAreas.includes("engagement")) {
    topics.push("Thought leadership piece on industry direction");
    topics.push("Commentary on latest technology trends");
    topics.push("Interactive question for community engagement");
    topics.push("Debate: best practices in my field");
  }

  if (weakestAreas.includes("portfolioQuality")) {
    topics.push("Deep dive: featured project showcase");
    topics.push("Technical case study from my work");
    topics.push("Code tutorial: solving common problem");
    topics.push("Project retrospective and learnings");
  }

  if (weakestAreas.includes("profileCompleteness")) {
    topics.push("Introduction to my professional journey");
    topics.push("My career path and why I chose this field");
    topics.push("Skills I've developed and how");
    topics.push("Professional goals for this year");
  }

  // Add general topics
  topics.push(`Advanced techniques in ${skills[0] || "my field"}`);
  topics.push(`Tools and resources I use for ${skills[1] || "productivity"}`);
  topics.push("Mentoring and helping junior developers");
  topics.push("Open source contributions and impact");

  return topics;
}

function generateWeekContent(
  weekNum: number,
  profile: UserProfile,
  analysis: BrandAnalysis,
  allTopics: string[]
): ContentItem[] {
  const items: ContentItem[] = [];
  const days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const topicIndex = weekNum * 3;
  const weekTopics = allTopics.slice(topicIndex, topicIndex + 4);

  // Monday: LinkedIn post (thought leadership or career insight)
  const roleHashtag = profile.currentRole ? `#${profile.currentRole.replace(/\s+/g, "")}` : "#Professional";
  items.push({
    day: "Monday",
    platform: "LinkedIn",
    contentType: "post",
    topic: weekTopics[0] || "Career growth strategy",
    description: `Share insights about ${weekTopics[0] || "professional development"}. Focus on actionable advice that resonates with your network.`,
    hashtags: [
      roleHashtag,
      "#CareerGrowth",
      "#ProfessionalDevelopment",
    ],
    bestTimeToPost: "8:00 AM",
  });

  // Tuesday: GitHub/Code (if they have GitHub, else Blog article)
  const skillHashtag = `#${(profile.skills?.[0] || "JavaScript").replace(/\s+/g, "")}`;
  if (profile.githubUrl) {
    items.push({
      day: "Tuesday",
      platform: "GitHub",
      contentType: "code",
      topic: weekTopics[1] || "Code tutorial",
      description: `Contribute to or showcase a project. Add documentation, create a new repository, or share a useful utility. Include a detailed README.`,
      hashtags: [
        skillHashtag,
        "#OpenSource",
        "#GitHub",
      ],
      bestTimeToPost: "10:00 AM",
    });
  } else {
    items.push({
      day: "Tuesday",
      platform: "Blog",
      contentType: "article",
      topic: weekTopics[1] || "Technical deep dive",
      description: `Write a detailed blog post about ${weekTopics[1] || "a technical topic"}. Include code examples, diagrams, and clear explanations.`,
      hashtags: ["#Blog", "#Technical", "#Tutorial"],
      bestTimeToPost: "10:00 AM",
    });
  }

  // Wednesday: Twitter/engagement thread
  const roleFirstWord = profile.currentRole ? profile.currentRole.split(" ")[0] : "Dev";
  const twitterHashtag = `#${roleFirstWord}`;
  items.push({
    day: "Wednesday",
    platform: "Twitter",
    contentType: "thread",
    topic: weekTopics[2] || "Hot take on industry trends",
    description: `Create an engaging Twitter thread about ${weekTopics[2] || "industry trends"}. Start with a hook, provide value in 5-7 tweets, and ask for thoughts.`,
    hashtags: ["#TechTwitter", "#DevCommunity", twitterHashtag],
    bestTimeToPost: "12:00 PM",
  });

  // Thursday or Friday: LinkedIn article or cross-post
  items.push({
    day: "Thursday",
    platform: "LinkedIn",
    contentType: "article",
    topic: weekTopics[3] || "Personal insights on career",
    description: `Share a longer-form article on LinkedIn about your experience with ${weekTopics[3] || "professional development"}. Be personal and authentic.`,
    hashtags: [
      roleHashtag,
      "#Insights",
      "#Learning",
    ],
    bestTimeToPost: "2:00 PM",
  });

  return items;
}

export function generateContentCalendar(profile: UserProfile, analysis: BrandAnalysis): ContentCalendar {
  const allTopics = getTopicsForWeakAreas(analysis, profile.skills || []);

  const weeks: ContentWeek[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday

  for (let week = 0; week < 4; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + week * 7);

    const items = generateWeekContent(week, profile, analysis, allTopics);

    weeks.push({
      week: week + 1,
      startDate: weekStart,
      items,
    });
  }

  return {
    weeks,
    generatedAt: new Date(),
    profile: {
      currentRole: profile.currentRole,
      skills: profile.skills || [],
      yearsExp: profile.yearsExp,
    },
  };
}

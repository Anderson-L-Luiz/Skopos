import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiJSON } from "@/lib/ai/client";
import { interviewQuestionsPrompt } from "@/lib/ai/prompts";
import type { InterviewQuestion } from "@/types";

const questionBank: Record<string, InterviewQuestion[]> = {
  behavioral: [
    { id: "b1", question: "Tell me about a time you had to handle a difficult technical problem under pressure.", category: "behavioral", difficulty: "medium", tips: "Use the STAR method: Situation, Task, Action, Result." },
    { id: "b2", question: "Describe a time you disagreed with a technical decision. How did you handle it?", category: "behavioral", difficulty: "medium", tips: "Show you can advocate for your views while remaining collaborative." },
    { id: "b3", question: "Tell me about a project you're most proud of and why.", category: "behavioral", difficulty: "easy", tips: "Focus on impact, leadership, and technical complexity." },
    { id: "b4", question: "How do you prioritize tasks when you have multiple competing deadlines?", category: "behavioral", difficulty: "medium", tips: "Demonstrate time management and stakeholder communication skills." },
    { id: "b5", question: "Describe a time you mentored someone. What was the outcome?", category: "behavioral", difficulty: "easy", tips: "Show empathy, patience, and knowledge-sharing ability." },
  ],
  technical: [
    { id: "t1", question: "Explain the difference between horizontal and vertical scaling. When would you use each?", category: "technical", difficulty: "medium", tips: "Cover trade-offs like cost, complexity, and state management." },
    { id: "t2", question: "How would you design a URL shortener like bit.ly?", category: "technical", difficulty: "hard", tips: "Cover database design, hashing, load balancing, and caching." },
    { id: "t3", question: "What is the difference between process and thread? How does this affect concurrent programming?", category: "technical", difficulty: "medium", tips: "Cover memory sharing, synchronization, and practical use cases." },
    { id: "t4", question: "Explain CAP theorem and how it applies to database selection.", category: "technical", difficulty: "hard", tips: "Be prepared to give real examples of CP vs AP databases." },
    { id: "t5", question: "How would you optimize a slow SQL query?", category: "technical", difficulty: "medium", tips: "Discuss indexing strategies, query plans, and denormalization." },
    { id: "t6", question: "Design a notification system that can handle 1 million events per second.", category: "technical", difficulty: "hard", tips: "Cover message queues, event streaming, consumer groups, and fan-out." },
  ],
  company: [
    { id: "c1", question: "Why do you want to work here specifically, rather than a competitor?", category: "company", difficulty: "easy", tips: "Research company values, recent launches, and culture specifics." },
    { id: "c2", question: "What do you know about our product and what would you improve?", category: "company", difficulty: "medium", tips: "Use the product beforehand. Suggest specific, evidence-based improvements." },
    { id: "c3", question: "How does our mission align with your personal career goals?", category: "company", difficulty: "easy", tips: "Be authentic. Connect their mission to your own motivations." },
  ],
  coding: [
    { id: "co1", question: "Implement a function to detect if a linked list has a cycle.", category: "coding", difficulty: "medium", tips: "Floyd's cycle detection algorithm (slow/fast pointer) is the optimal solution." },
    { id: "co2", question: "Given a string, find the longest substring without repeating characters.", category: "coding", difficulty: "medium", tips: "Sliding window with a hash set is O(n). Walk through edge cases." },
    { id: "co3", question: "Implement a LRU (Least Recently Used) cache.", category: "coding", difficulty: "hard", tips: "Use a doubly linked list + hash map for O(1) operations." },
    { id: "co4", question: "Find the kth largest element in an unsorted array.", category: "coding", difficulty: "medium", tips: "QuickSelect is O(n) average. A min-heap approach is O(n log k)." },
  ],
};

function generateRoleSpecificQuestions(
  jobTitle: string,
  company: string,
  requiredSkills: string[]
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let idCounter = 1000;

  // Company-specific behavioral questions
  questions.push({
    id: `company_${idCounter++}`,
    question: `Why do you want to work at ${company} specifically?`,
    category: "company",
    difficulty: "easy",
    tips: "Research the company's mission, values, recent news, and products. Connect their goals to your career aspirations.",
  });

  questions.push({
    id: `company_${idCounter++}`,
    question: `What do you know about ${company}'s product and industry position, and how would you contribute?`,
    category: "company",
    difficulty: "medium",
    tips: "Show genuine interest in their business. Mention specific products, features, or strategic initiatives.",
  });

  // Role-specific technical questions based on job title and skills
  const skillQuestions: Record<string, InterviewQuestion[]> = {
    react: [
      {
        id: `tech_${idCounter++}`,
        question: "How would you optimize performance in a large React application?",
        category: "technical",
        difficulty: "medium",
        tips: "Discuss React.memo, useMemo, useCallback, code splitting, lazy loading, and Suspense boundaries.",
      },
      {
        id: `tech_${idCounter++}`,
        question: "Explain the difference between controlled and uncontrolled components.",
        category: "technical",
        difficulty: "medium",
        tips: "Controlled components manage state in React, uncontrolled components rely on DOM. Discuss when to use each.",
      },
    ],
    typescript: [
      {
        id: `tech_${idCounter++}`,
        question: "How do you use TypeScript generics to write flexible and reusable code?",
        category: "technical",
        difficulty: "medium",
        tips: "Provide examples of generic functions, interfaces, and constraints. Discuss utility types like Omit, Pick, Record.",
      },
    ],
    python: [
      {
        id: `tech_${idCounter++}`,
        question: "Explain decorators in Python and provide a real-world use case.",
        category: "technical",
        difficulty: "medium",
        tips: "Show understanding of closures, functional programming, and how decorators modify function behavior.",
      },
    ],
    nodejs: [
      {
        id: `tech_${idCounter++}`,
        question: "How does the Node.js event loop work and how would you avoid blocking it?",
        category: "technical",
        difficulty: "hard",
        tips: "Discuss microtasks, macrotasks, async/await, callbacks, and the dangers of CPU-intensive synchronous operations.",
      },
    ],
    aws: [
      {
        id: `tech_${idCounter++}`,
        question: "How would you design a scalable application architecture on AWS?",
        category: "technical",
        difficulty: "hard",
        tips: "Discuss EC2, Lambda, RDS, DynamoDB, S3, CloudFront, auto-scaling, and high availability patterns.",
      },
    ],
    docker: [
      {
        id: `tech_${idCounter++}`,
        question: "Explain Docker best practices for creating efficient container images.",
        category: "technical",
        difficulty: "medium",
        tips: "Discuss multi-stage builds, layer caching, minimizing image size, security, and Docker Compose.",
      },
    ],
    sql: [
      {
        id: `tech_${idCounter++}`,
        question: "How would you optimize a slow database query with millions of records?",
        category: "technical",
        difficulty: "medium",
        tips: "Discuss indexing strategies, query execution plans, denormalization, and query refactoring.",
      },
    ],
  };

  // Add skill-specific questions
  for (const skill of requiredSkills) {
    const skillLower = skill.toLowerCase();
    if (skillLower in skillQuestions) {
      const sq = skillQuestions[skillLower as keyof typeof skillQuestions];
      questions.push(...sq.slice(0, 1)); // Add first question for each skill
    }
  }

  // Role-specific behavioral questions
  if (jobTitle.toLowerCase().includes("senior") || jobTitle.toLowerCase().includes("lead")) {
    questions.push({
      id: `behavioral_${idCounter++}`,
      question: "Tell me about a time you led a technical initiative or mentored a junior engineer.",
      category: "behavioral",
      difficulty: "medium",
      tips: "Focus on impact, growth of others, and how you balanced mentoring with delivery.",
    });
  }

  if (jobTitle.toLowerCase().includes("full stack") || jobTitle.toLowerCase().includes("engineer")) {
    questions.push({
      id: `behavioral_${idCounter++}`,
      question: "Describe a time you had to work on both frontend and backend to solve a problem.",
      category: "behavioral",
      difficulty: "medium",
      tips: "Show how you approach system-wide thinking and collaboration across different domains.",
    });
  }

  return questions;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const role = searchParams.get("role");
  const jobId = searchParams.get("jobId");

  let questions: InterviewQuestion[] = [];

  // Fetch role-specific questions if jobId is provided
  if (jobId) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (job) {
        const skills = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || "[]");

        // Try AI-generated questions first
        try {
          const aiQuestions = await aiJSON<InterviewQuestion[]>({
            messages: interviewQuestionsPrompt(
              job.title,
              job.description,
              skills,
              category !== "all" ? category : "technical",
              difficulty !== "all" ? difficulty : "medium"
            ),
            temperature: 0.3,
          });

          if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
            questions = aiQuestions.map((q, i) => ({
              ...q,
              id: `ai_${i}`,
            }));
          }
        } catch {
          // Fall back to static role-specific questions
          const roleSpecificQuestions = generateRoleSpecificQuestions(job.title, job.company, skills);
          questions = [...roleSpecificQuestions];
        }
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }

  // Add generic questions from question bank
  let genericQuestions: InterviewQuestion[] = [];
  if (category === "all") {
    genericQuestions = Object.values(questionBank).flat();
  } else {
    genericQuestions = questionBank[category] || [];
  }

  // Combine role-specific and generic questions
  questions = [...questions, ...genericQuestions];

  if (difficulty !== "all") {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  return NextResponse.json({ questions });
}

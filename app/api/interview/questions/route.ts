import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "all";

  let questions: InterviewQuestion[] = [];

  if (category === "all") {
    questions = Object.values(questionBank).flat();
  } else {
    questions = questionBank[category] || [];
  }

  if (difficulty !== "all") {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  return NextResponse.json({ questions });
}

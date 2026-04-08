/**
 * AI Service Layer — Unified client that supports:
 * 1. DunamisV2 (Gemini via OpenAI-compatible proxy on localhost:6970)
 * 2. Anthropic Claude API (claude-sonnet-4-6, claude-haiku-4-5, etc.)
 * 3. Direct OpenAI API as final fallback
 *
 * Priority order: DunamisV2 → Claude → OpenAI
 * Adapted from CvMaker helper.py and DunamisV2 server.py patterns.
 */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIRequestOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: {
    name: string;
    schema: Record<string, unknown>;
  };
}

interface AIResponse {
  content: string;
  model: string;
  provider: "dunamis" | "anthropic" | "openai";
}

const DUNAMIS_URL = process.env.DUNAMIS_URL || "http://127.0.0.1:6970";
const DUNAMIS_MODEL = process.env.DUNAMIS_MODEL || "gemini-3.0-flash";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Clean LLM response: strip markdown fences, extract JSON if present
 * Ported from DunamisV2 server.py _clean_response()
 */
function cleanResponse(text: string): string {
  let cleaned = text.trim();
  // Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/gm, "").replace(/\n?```\s*$/gm, "");
  cleaned = cleaned.trim();
  return cleaned;
}

/**
 * Extract JSON from a response that may contain surrounding text
 */
export function extractJSON<T = unknown>(text: string): T {
  const cleaned = cleanResponse(text);

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Find outermost JSON object or array
    const startObj = cleaned.indexOf("{");
    const startArr = cleaned.indexOf("[");
    const start = startObj === -1 ? startArr : startArr === -1 ? startObj : Math.min(startObj, startArr);

    if (start === -1) throw new Error("No JSON found in response");

    const isArray = cleaned[start] === "[";
    const closer = isArray ? "]" : "}";
    const opener = isArray ? "[" : "{";

    let depth = 0;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === opener) depth++;
      if (cleaned[i] === closer) depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.substring(start, i + 1));
      }
    }
    throw new Error("Unbalanced JSON in response");
  }
}

/**
 * Call DunamisV2 (Gemini proxy) — OpenAI-compatible endpoint
 */
async function callDunamis(options: AIRequestOptions): Promise<AIResponse> {
  const body: Record<string, unknown> = {
    model: DUNAMIS_MODEL,
    messages: options.messages,
    stream: false,
    temperature: options.temperature ?? 0,
  };

  if (options.maxTokens) body.max_tokens = options.maxTokens;
  if (options.jsonSchema) {
    body.response_format = {
      type: "json_schema",
      json_schema: options.jsonSchema,
    };
  }

  const res = await fetch(`${DUNAMIS_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    throw new Error(`DunamisV2 error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: DUNAMIS_MODEL,
    provider: "dunamis",
  };
}

/**
 * Call Anthropic Claude API directly
 * Docs: https://docs.anthropic.com/en/api/messages
 */
async function callAnthropic(options: AIRequestOptions): Promise<AIResponse> {
  if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");

  // Anthropic uses a separate system parameter (not in messages array)
  const systemMessages = options.messages.filter((m) => m.role === "system");
  const nonSystemMessages = options.messages.filter((m) => m.role !== "system");

  const body: Record<string, unknown> = {
    model: ANTHROPIC_MODEL,
    max_tokens: options.maxTokens || 4096,
    messages: nonSystemMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    temperature: options.temperature ?? 0,
  };

  // Add system prompt if present
  if (systemMessages.length > 0) {
    body.system = systemMessages.map((m) => m.content).join("\n\n");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  // Anthropic returns content as an array of content blocks
  const textContent = (data.content || [])
    .filter((block: { type: string }) => block.type === "text")
    .map((block: { text: string }) => block.text)
    .join("");

  return {
    content: textContent,
    model: ANTHROPIC_MODEL,
    provider: "anthropic",
  };
}

/**
 * Call OpenAI directly
 */
async function callOpenAI(options: AIRequestOptions): Promise<AIResponse> {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");

  const body: Record<string, unknown> = {
    model: OPENAI_MODEL,
    messages: options.messages,
    temperature: options.temperature ?? 0,
  };

  if (options.maxTokens) body.max_tokens = options.maxTokens;
  if (options.jsonSchema) {
    body.response_format = {
      type: "json_schema",
      json_schema: {
        name: options.jsonSchema.name,
        strict: true,
        schema: options.jsonSchema.schema,
      },
    };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: OPENAI_MODEL,
    provider: "openai",
  };
}

/**
 * Check if DunamisV2 service is available
 */
async function isDunamisAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${DUNAMIS_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Main AI call — priority: DunamisV2 → Claude → OpenAI
 */
export async function aiChat(options: AIRequestOptions): Promise<AIResponse> {
  const errors: string[] = [];

  // 1. Try DunamisV2 first (free, local Gemini)
  const dunamisUp = await isDunamisAvailable();
  if (dunamisUp) {
    try {
      return await callDunamis(options);
    } catch (err) {
      errors.push(`DunamisV2: ${err}`);
    }
  }

  // 2. Try Anthropic Claude
  if (ANTHROPIC_API_KEY) {
    try {
      return await callAnthropic(options);
    } catch (err) {
      errors.push(`Anthropic: ${err}`);
    }
  }

  // 3. Try OpenAI
  if (OPENAI_API_KEY) {
    try {
      return await callOpenAI(options);
    } catch (err) {
      errors.push(`OpenAI: ${err}`);
    }
  }

  // All providers failed
  const configuredProviders = [
    dunamisUp ? "DunamisV2 (running)" : null,
    ANTHROPIC_API_KEY ? "Anthropic (key set)" : null,
    OPENAI_API_KEY ? "OpenAI (key set)" : null,
  ].filter(Boolean);

  if (configuredProviders.length === 0) {
    throw new Error(
      "No AI provider available. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or start DunamisV2."
    );
  }

  throw new Error(
    `All AI providers failed:\n${errors.join("\n")}`
  );
}

/**
 * Convenience: AI call that returns parsed JSON
 */
export async function aiJSON<T = unknown>(options: AIRequestOptions): Promise<T> {
  const response = await aiChat(options);
  return extractJSON<T>(response.content);
}

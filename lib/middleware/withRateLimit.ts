import { NextRequest, NextResponse } from "next/server";
import type { RateLimitResult } from "@/lib/rateLimit";

/**
 * Helper to extract client IP from request headers
 * Falls back to a default value if not available
 */
export function getClientIp(request: NextRequest | Request): string {
  if (request instanceof NextRequest) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";
    return ip;
  }
  return "unknown";
}

/**
 * Wraps an API route handler with rate limiting
 * @param handler - The API route handler function
 * @param checkLimit - The rate limit checker function
 * @param limitType - Optional label for logging (e.g., "auth", "scrape")
 * @returns Wrapped handler with rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest | Request) => Promise<Response>,
  checkLimit: (key: string) => RateLimitResult,
  limitType: string = "api"
) {
  return async (req: NextRequest | Request): Promise<Response> => {
    const clientIp = getClientIp(req);
    const result = checkLimit(clientIp);

    if (!result.success) {
      const retryAfter = Math.ceil((result.reset.getTime() - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": "reached",
          },
        }
      );
    }

    // Continue to the actual handler
    return handler(req);
  };
}

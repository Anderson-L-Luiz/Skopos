export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limiter for API endpoints
 * Tracks requests per IP/key and automatically cleans up expired entries
 */
export function rateLimit(options: RateLimitOptions) {
  const store = new Map<string, RequestRecord>();

  return function checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    const record = store.get(key);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      const keysToDelete: string[] = [];
      store.forEach((v, k) => {
        if (now > v.resetTime) {
          keysToDelete.push(k);
        }
      });
      keysToDelete.forEach((k) => store.delete(k));
    }

    if (!record || now > record.resetTime) {
      // New window
      const resetTime = now + options.windowMs;
      store.set(key, { count: 1, resetTime });
      return {
        success: true,
        remaining: options.max - 1,
        reset: new Date(resetTime),
      };
    }

    // Within existing window
    if (record.count < options.max) {
      record.count++;
      return {
        success: true,
        remaining: options.max - record.count,
        reset: new Date(record.resetTime),
      };
    }

    // Limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: new Date(record.resetTime),
    };
  };
}

// Pre-configured rate limiters for different endpoint types
export const authLimiter = rateLimit({ windowMs: 60000, max: 10 }); // 10 req/min
export const writeOpLimiter = rateLimit({ windowMs: 60000, max: 30 }); // 30 req/min
export const readOpLimiter = rateLimit({ windowMs: 60000, max: 60 }); // 60 req/min
export const expensiveOpLimiter = rateLimit({ windowMs: 60000, max: 5 }); // 5 req/min

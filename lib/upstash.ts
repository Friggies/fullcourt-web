import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import type { Duration } from '@upstash/ratelimit';
import {
  createBypassedRateLimitResult,
  shouldBypassRateLimit,
  type RateLimiter,
} from '@/lib/rate-limit';

let redis: Redis | null = null;

function getRedis() {
  redis ??= Redis.fromEnv();
  return redis;
}

type SlidingWindowConfig = {
  prefix: string;
  limit: number;
  window: Duration;
  analytics?: boolean;
};

export function createSlidingWindowLimiter({
  prefix,
  limit,
  window,
  analytics = false,
}: SlidingWindowConfig): RateLimiter {
  let limiter: RateLimiter | null = null;

  return {
    limit: async identifier => {
      if (shouldBypassRateLimit()) {
        return createBypassedRateLimitResult();
      }

      limiter ??= new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(limit, window),
        prefix,
        analytics,
        // Keep this outside route handlers so hot instances can deny repeat hits
        // without another Redis round-trip.
        ephemeralCache: new Map<string, number>(),
      });

      return limiter.limit(identifier);
    },
  };
}

export const rateLimiters = {
  kitSubscribe: createSlidingWindowLimiter({
    prefix: 'ratelimit:kit-subscribe',
    limit: 5,
    window: '30 m',
    analytics: false,
  }),
  testimonialSubmit: createSlidingWindowLimiter({
    prefix: 'ratelimit:testimonial-submit',
    limit: 5,
    window: '120 m',
  }),
  commentSubmit: createSlidingWindowLimiter({
    prefix: 'ratelimit:comment-submit',
    limit: 5,
    window: '60 m',
  }),
  reactionToggle: createSlidingWindowLimiter({
    prefix: 'ratelimit:reaction-toggle',
    limit: 20,
    window: '60 m',
  }),
} as const;

import { Redis } from '@upstash/redis';
import { Duration, Ratelimit } from '@upstash/ratelimit';

export const redis = Redis.fromEnv();

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
}: SlidingWindowConfig) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
    analytics,
    // Keep this outside route handlers so hot instances can deny repeat hits
    // without another Redis round-trip.
    ephemeralCache: new Map<string, number>(),
  });
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
} as const;

import { NextResponse } from 'next/server';

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimiter = {
  limit: (identifier: string) => Promise<RateLimitResult>;
};

export function getClientIp(req: Request): string {
  // Best choice on deployed Netlify functions
  const netlifyIp = req.headers.get('x-nf-client-connection-ip');
  if (netlifyIp) return netlifyIp.trim();

  // Common proxy/CDN fallback
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // Helpful in some local `netlify dev` setups
  const clientIp = req.headers.get('client-ip');
  if (clientIp) return clientIp.trim();

  // Safe fallback: everyone without an IP shares one bucket
  return 'unknown';
}

export async function limitByIp(req: Request, limiter: RateLimiter) {
  const ip = getClientIp(req);
  return limiter.limit(ip);
}

export function applyRateLimitHeaders(
  response: Response,
  result: RateLimitResult
) {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set(
    'X-RateLimit-Remaining',
    String(Math.max(0, result.remaining))
  );
  response.headers.set('X-RateLimit-Reset', String(result.reset));
  return response;
}

export function rateLimitExceeded(
  result: RateLimitResult,
  message = 'Too many requests. Please try again later.'
) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000)
  );

  const response = NextResponse.json({ error: message }, { status: 429 });

  applyRateLimitHeaders(response, result);
  response.headers.set('Retry-After', String(retryAfterSeconds));

  return response;
}

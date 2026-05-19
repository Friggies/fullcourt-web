/**
 * @jest-environment node
 */

import {
  applyRateLimitHeaders,
  getClientIp,
  limitByIp,
  rateLimitExceeded,
  shouldBypassRateLimit,
} from '@/lib/rate-limit';

const originalEnv = process.env;

afterEach(() => {
  process.env = { ...originalEnv };
});

test('getClientIp prefers x-nf-client-connection-ip when present', () => {
  //Arrange
  const req = new Request('http://localhost', {
    headers: {
      'x-nf-client-connection-ip': ' 203.0.113.10 ',
      'x-forwarded-for': '198.51.100.1',
    },
  });

  //Act
  const ip = getClientIp(req);

  //Assert
  expect(ip).toBe('203.0.113.10');
});

test('getClientIp falls back to first x-forwarded-for value', () => {
  //Arrange
  const req = new Request('http://localhost', {
    headers: { 'x-forwarded-for': ' 198.51.100.1 , 198.51.100.2 ' },
  });

  //Act
  const ip = getClientIp(req);

  //Assert
  expect(ip).toBe('198.51.100.1');
});

test('getClientIp falls back to x-real-ip then client-ip then unknown', () => {
  //Arrange / Act / Assert
  const req1 = new Request('http://localhost', {
    headers: { 'x-real-ip': '203.0.113.99' },
  });
  expect(getClientIp(req1)).toBe('203.0.113.99');

  const req2 = new Request('http://localhost', {
    headers: { 'client-ip': '1.1.1.1' },
  });
  expect(getClientIp(req2)).toBe('1.1.1.1');

  const req3 = new Request('http://localhost');
  expect(getClientIp(req3)).toBe('unknown');
});

test('applyRateLimitHeaders sets rate limit headers on response', () => {
  //Arrange
  const res = new Response('ok');
  const result = { success: true, limit: 5, remaining: 2, reset: 1234567890 };

  //Act
  const out = applyRateLimitHeaders(res, result);

  //Assert
  expect(out.headers.get('X-RateLimit-Limit')).toBe('5');
  expect(out.headers.get('X-RateLimit-Remaining')).toBe('2');
  expect(out.headers.get('X-RateLimit-Reset')).toBe('1234567890');
});

test('rateLimitExceeded returns 429 with Retry-After and rate limit headers', async () => {
  //Arrange
  const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

  const result = {
    success: false,
    limit: 5,
    remaining: 0,
    reset: 1_700_000_010_000, // +10s
  };

  //Act
  const res = rateLimitExceeded(result, 'Too many requests');

  //Assert
  expect(res.status).toBe(429);
  expect(res.headers.get('Retry-After')).toBe('10');
  expect(res.headers.get('X-RateLimit-Limit')).toBe('5');
  expect(res.headers.get('X-RateLimit-Remaining')).toBe('0');
  expect(res.headers.get('X-RateLimit-Reset')).toBe(String(result.reset));

  const payload = await res.json();
  expect(payload).toEqual({ error: 'Too many requests' });

  nowSpy.mockRestore();
});

test('limitByIp bypasses the limiter when explicitly enabled outside Netlify', async () => {
  process.env = {
    ...originalEnv,
    BYPASS_UPSTASH_RATE_LIMIT: 'true',
    NETLIFY: undefined,
  };

  const req = new Request('http://localhost');
  const limiter = { limit: jest.fn() };

  const result = await limitByIp(req, limiter);

  expect(shouldBypassRateLimit()).toBe(true);
  expect(limiter.limit).not.toHaveBeenCalled();
  expect(result.success).toBe(true);
});

test('limitByIp still calls the limiter on Netlify even when bypass is set', async () => {
  process.env = {
    ...originalEnv,
    BYPASS_UPSTASH_RATE_LIMIT: 'true',
    NETLIFY: 'true',
  };

  const req = new Request('http://localhost', {
    headers: { 'x-forwarded-for': '198.51.100.1' },
  });
  const limiter = {
    limit: jest.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: 123,
    }),
  };

  const result = await limitByIp(req, limiter);

  expect(shouldBypassRateLimit()).toBe(false);
  expect(limiter.limit).toHaveBeenCalledWith('198.51.100.1');
  expect(result).toEqual({
    success: true,
    limit: 5,
    remaining: 4,
    reset: 123,
  });
});

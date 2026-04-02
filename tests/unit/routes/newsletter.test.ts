/**
 * @jest-environment node
 */
export {};

let mockLimitByIp: jest.Mock;
let mockApplyRateLimitHeaders: jest.Mock;
let mockRateLimitExceeded: jest.Mock;
let mockVerifyTurnstileToken: jest.Mock;

jest.mock('@/lib/upstash', () => ({
  rateLimiters: {
    kitSubscribe: {},
  },
}));

jest.mock('@/lib/rate-limit', () => ({
  limitByIp: (...args: unknown[]) => mockLimitByIp(...args),
  applyRateLimitHeaders: (...args: unknown[]) =>
    mockApplyRateLimitHeaders(...args),
  rateLimitExceeded: (...args: unknown[]) => mockRateLimitExceeded(...args),
}));

jest.mock('@/lib/turnstile', () => ({
  verifyTurnstileToken: (...args: unknown[]) =>
    mockVerifyTurnstileToken(...args),
}));

beforeEach(() => {
  mockLimitByIp = jest.fn().mockResolvedValue({
    success: true,
    limit: 5,
    remaining: 4,
    reset: Date.now() + 60_000,
  });

  mockApplyRateLimitHeaders = jest.fn((res: Response) => res);

  mockRateLimitExceeded = jest.fn(() => {
    return new Response(JSON.stringify({ error: 'rate limited' }), {
      status: 429,
    });
  });

  mockVerifyTurnstileToken = jest.fn().mockResolvedValue({
    success: true,
    action: 'newsletter_signup',
  });
});

function makeReq(
  form: Record<string, string>,
  headers?: Record<string, string>
) {
  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => fd.set(k, v));

  return {
    headers: new Headers(headers ?? {}),
    formData: async () => fd,
  } as unknown as Request;
}

test('returns 429 when rate limit fails', async () => {
  mockLimitByIp.mockResolvedValueOnce({
    success: false,
    limit: 5,
    remaining: 0,
    reset: Date.now() + 60_000,
  });

  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    email: 'user@example.com',
    'cf-turnstile-response': 'tok',
  });

  const res = await POST(req);

  expect(res.status).toBe(429);

  const payload = await res.json();

  expect(payload).toEqual({ error: 'rate limited' });
});

test('returns 400 when email is missing', async () => {
  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    'cf-turnstile-response': 'tok',
  });

  const res = await POST(req);

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: 'Email is required' });
});

test('returns 400 when email format is invalid', async () => {
  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    email: 'not-an-email',
    'cf-turnstile-response': 'tok',
  });

  const res = await POST(req);

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: 'Invalid email format' });
});

test('returns 400 when Turnstile token is missing', async () => {
  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    email: 'user@example.com',
  });

  const res = await POST(req);

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: 'Missing verification token' });
});

test('returns 400 when Turnstile verification fails', async () => {
  mockVerifyTurnstileToken.mockResolvedValueOnce({ success: false });

  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    email: 'user@example.com',
    'cf-turnstile-response': 'tok',
  });

  const res = await POST(req);

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    error: 'Verification failed. Please try again.',
  });
});

test('returns 500 when KIT env vars are missing', async () => {
  delete process.env.KIT_API_KEY;
  delete process.env.KIT_FORM_ID;

  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq({
    email: 'user@example.com',
    'cf-turnstile-response': 'tok',
  });

  const res = await POST(req);

  expect(res.status).toBe(500);
  expect(await res.json()).toEqual({ error: 'Server misconfiguration' });
});

test('returns ok:true after successful Kit subscriber upsert + form add', async () => {
  process.env.KIT_API_KEY = 'kit-key';
  process.env.KIT_FORM_ID = '123';

  const fetchSpy = jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(new Response('', { status: 200 }))
    .mockResolvedValueOnce(new Response('', { status: 200 }));

  const { POST } = await import('@/app/api/newsletter/route');

  const req = makeReq(
    {
      email: 'USER@EXAMPLE.COM',
      'cf-turnstile-response': 'tok',
    },
    {
      'cf-connecting-ip': '203.0.113.10',
    }
  );

  const res = await POST(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });

  expect(fetchSpy).toHaveBeenCalledTimes(2);

  expect(fetchSpy.mock.calls[0][0]).toBe('https://api.kit.com/v4/subscribers');
  expect(fetchSpy.mock.calls[1][0]).toBe(
    'https://api.kit.com/v4/forms/123/subscribers'
  );

  expect(mockApplyRateLimitHeaders).toHaveBeenCalled();

  fetchSpy.mockRestore();
});

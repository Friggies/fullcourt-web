/**
 * @jest-environment node
 */
export {};

let mockLimitByIp: jest.Mock;
let mockApplyRateLimitHeaders: jest.Mock;
let mockRateLimitExceeded: jest.Mock;
let mockVerifyTurnstileToken: jest.Mock;
let mockCreateClient: jest.Mock;

jest.mock('@/lib/upstash', () => ({
  rateLimiters: {
    testimonialSubmit: {},
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

jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

jest.mock('sharp', () => ({
  __esModule: true,
  default: () => ({
    rotate: () => ({
      resize: () => ({
        webp: () => ({
          toBuffer: async () => Buffer.from('webp-bytes'),
        }),
      }),
    }),
  }),
}));

function makeReq(form: FormData, headers?: Record<string, string>) {
  return {
    headers: new Headers(headers ?? {}),
    formData: async () => form,
  } as unknown as Request;
}

beforeEach(() => {
  jest.resetModules();

  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';

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
    action: 'testimonial_submit',
  });

  mockCreateClient = jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: 'https://example.com/public.webp' },
        })),
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => ({ data: { id: 123 }, error: null })),
        })),
      })),
    })),
  }));
});

test('returns 500 when Supabase env vars are missing (module-scope constants)', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');

  const res = await POST(makeReq(form));

  expect(res.status).toBe(500);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Server not configured (missing env vars).',
  });
});

test('returns 400 when Turnstile token is missing', async () => {
  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();

  const res = await POST(makeReq(form));

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Missing Turnstile token.',
  });
});

test('returns 400 when Turnstile verification fails', async () => {
  mockVerifyTurnstileToken.mockResolvedValueOnce({ success: false });

  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');

  const res = await POST(makeReq(form));

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Verification failed. Please try again.',
  });
});

test('returns 400 when required fields are missing', async () => {
  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');
  form.set('rating', '5');

  const res = await POST(makeReq(form));

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Missing required fields (name/content/email/title).',
  });
});

test('returns 400 when rating is outside 1..5', async () => {
  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');
  form.set('display_name', 'Jane');
  form.set('email', 'jane@example.com');
  form.set('title', 'Great');
  form.set('content', 'Loved it');
  form.set('rating', '6');

  const res = await POST(makeReq(form));

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Rating must be between 1 and 5.',
  });
});

test('rejects non-image uploads', async () => {
  const { POST } = await import('@/app/api/testimonial/route');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');
  form.set('display_name', 'Jane');
  form.set('email', 'jane@example.com');
  form.set('title', 'Great');
  form.set('content', 'Loved it');
  form.set('rating', '5');

  form.set('image', new File(['hello'], 'note.txt', { type: 'text/plain' }));

  const res = await POST(makeReq(form));

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    ok: false,
    error: 'Invalid file type. Please upload an image.',
  });
});

test('uploads image, inserts testimonial, and returns ok:true with id', async () => {
  const { POST } = await import('@/app/api/testimonial/route');

  const upload = jest.fn().mockResolvedValue({ error: null });
  const getPublicUrl = jest.fn(() => ({
    data: { publicUrl: 'https://example.com/testimonial.webp' },
  }));
  const storageFrom = jest.fn(() => ({ upload, getPublicUrl }));

  const single = jest.fn(async () => ({ data: { id: 999 }, error: null }));
  const select = jest.fn(() => ({ single }));
  const insert = jest.fn(() => ({ select }));
  const from = jest.fn(() => ({ insert }));

  mockCreateClient.mockReturnValueOnce({
    storage: { from: storageFrom },
    from,
  });

  const uuidSpy = jest
    .spyOn(globalThis.crypto, 'randomUUID')
    .mockReturnValue('uuid-123');

  const form = new FormData();
  form.set('cf-turnstile-response', 'tok');
  form.set('display_name', 'John Doe');
  form.set('email', 'john@example.com');
  form.set('title', 'Amazing');
  form.set('content', 'Best training resource');
  form.set('rating', '5');

  form.set(
    'image',
    new File([new Uint8Array([1, 2, 3])], 'avatar.png', { type: 'image/png' })
  );

  const res = await POST(makeReq(form, { 'cf-connecting-ip': '203.0.113.9' }));

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true, id: 999 });

  expect(upload).toHaveBeenCalledWith(
    'john-doe-uuid-123.webp',
    expect.any(Buffer),
    expect.objectContaining({
      contentType: 'image/webp',
      upsert: false,
    })
  );

  expect(getPublicUrl).toHaveBeenCalledWith('john-doe-uuid-123.webp');

  expect(insert).toHaveBeenCalledWith(
    expect.objectContaining({
      email: 'john@example.com',
      display_name: 'John Doe',
      title: 'Amazing',
      content: 'Best training resource',
      image: 'https://example.com/testimonial.webp',
      rating: 5,
    })
  );

  expect(mockApplyRateLimitHeaders).toHaveBeenCalled();

  uuidSpy.mockRestore();
});

/**
 * @jest-environment node
 */

import { getClientApiError } from '@/lib/client-rate-limit';

function makeResponse(
  body: string,
  init: { status: number; headers?: Record<string, string> }
): Response {
  return new Response(body, {
    status: init.status,
    headers: init.headers,
  });
}

test('returns non-rate-limited error when status is not 429', async () => {
  //Arrange
  const res = makeResponse(JSON.stringify({ error: 'Bad request' }), {
    status: 400,
  });

  //Act
  const err = await getClientApiError(res, 'Fallback');

  //Assert
  expect(err.isRateLimited).toBe(false);
  expect(err.retryAfterMs).toBeNull();
  expect(err.message).toBe('Bad request');
});

test('returns fallback message when response body is not JSON', async () => {
  //Arrange
  const res = makeResponse('not-json', { status: 500 });

  //Act
  const err = await getClientApiError(res, 'Fallback');

  //Assert
  expect(err.isRateLimited).toBe(false);
  expect(err.message).toBe('Fallback');
});

test('parses retry-after header for 429 as retryAfterMs', async () => {
  //Arrange
  const res = makeResponse(JSON.stringify({ error: 'Too many requests.' }), {
    status: 429,
    headers: { 'retry-after': '60' },
  });

  //Act
  const err = await getClientApiError(res, 'Fallback');

  //Assert
  expect(err.isRateLimited).toBe(true);
  expect(err.retryAfterMs).toBe(60_000);
  expect(err.message).toContain('Please try again in 1 minute.');
});

test('falls back to x-ratelimit-reset when retry-after is missing or invalid', async () => {
  //Arrange
  const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  const resetTs = 1_700_000_060_000; // +60s

  const res = makeResponse(JSON.stringify({ error: 'Too many requests' }), {
    status: 429,
    headers: { 'x-ratelimit-reset': String(resetTs) },
  });

  //Act
  const err = await getClientApiError(res, 'Fallback');

  //Assert
  expect(err.isRateLimited).toBe(true);
  expect(err.retryAfterMs).toBe(60_000);
  expect(err.message).toContain('Please try again in 1 minute.');

  nowSpy.mockRestore();
});

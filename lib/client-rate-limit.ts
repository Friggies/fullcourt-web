export type ClientApiError = {
  isRateLimited: boolean;
  retryAfterMs: number | null;
  message: string;
};

function formatRetryAfter(ms: number) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));

  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds === 1 ? '' : 's'}`;
  }

  const totalMinutes = Math.ceil(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`;
  }

  const totalHours = Math.ceil(totalMinutes / 60);
  return `${totalHours} hour${totalHours === 1 ? '' : 's'}`;
}

export async function getClientApiError(
  res: Response,
  fallbackMessage: string
): Promise<ClientApiError> {
  let payload: { error?: string } | null = null;

  try {
    payload = (await res.json()) as { error?: string };
  } catch {
    payload = null;
  }

  const baseMessage = payload?.error || fallbackMessage;

  if (res.status !== 429) {
    return {
      isRateLimited: false,
      retryAfterMs: null,
      message: baseMessage,
    };
  }

  let retryAfterMs: number | null = null;

  const retryAfterHeader = res.headers.get('retry-after');
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    retryAfterMs = retryAfterSeconds * 1000;
  } else {
    const resetHeader = res.headers.get('x-ratelimit-reset');
    const resetTs = resetHeader ? Number(resetHeader) : NaN;

    if (Number.isFinite(resetTs) && resetTs > Date.now()) {
      retryAfterMs = resetTs - Date.now();
    }
  }

  const cleanBase = baseMessage.endsWith('.')
    ? baseMessage.slice(0, -1)
    : baseMessage;

  return {
    isRateLimited: true,
    retryAfterMs,
    message: retryAfterMs
      ? `${cleanBase}. Please try again in ${formatRetryAfter(retryAfterMs)}.`
      : `${cleanBase}. Please try again later.`,
  };
}

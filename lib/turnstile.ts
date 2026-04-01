export type TurnstileVerifyResult = {
  success: boolean;
  'error-codes'?: string[];
  hostname?: string;
  action?: string;
  cdata?: string;
  challenge_ts?: string;
};

export async function verifyTurnstileToken(params: {
  token: string;
  ip?: string;
}): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY is not set');
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', params.token);
  if (params.ip) body.set('remoteip', params.ip);

  const resp = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    }
  );

  if (!resp.ok) {
    return { success: false, 'error-codes': ['turnstile_unreachable'] };
  }

  return (await resp.json()) as TurnstileVerifyResult;
}

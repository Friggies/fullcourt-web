import { NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/upstash';
import {
  applyRateLimitHeaders,
  limitByIp,
  rateLimitExceeded,
} from '@/lib/rate-limit';

export async function POST(req: Request) {
  const rate = await limitByIp(req, rateLimiters.kitSubscribe);

  if (!rate.success) {
    return rateLimitExceeded(
      rate,
      'Too many signup attempts. Please try again later.'
    );
  }

  let email = '';

  try {
    const body = await req.json();
    email = typeof body?.email === 'string' ? body.email.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  try {
    // 1) Upsert subscriber
    const createRes = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return NextResponse.json(
        { error: 'Create subscriber failed', details: err },
        { status: 500 }
      );
    }

    // 2) Add to form
    const addRes = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': apiKey,
        },
        body: JSON.stringify({ email_address: email }),
      }
    );

    if (!addRes.ok) {
      const err = await addRes.text();
      return NextResponse.json(
        { error: 'Add to form failed', details: err },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ ok: true });
    applyRateLimitHeaders(response, rate);
    return response;
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY!;
  const formId = process.env.KIT_FORM_ID!; // set in .env

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

    // 2) Add to form (by email)
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

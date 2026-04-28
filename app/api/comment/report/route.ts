import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { rateLimiters } from '@/lib/upstash';
import {
  applyRateLimitHeaders,
  limitByIp,
  rateLimitExceeded,
} from '@/lib/rate-limit';

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Safe fallback.
          }
        },
      },
    }
  );
}

function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const rate = await limitByIp(req, rateLimiters.commentSubmit);

  if (!rate.success) {
    return rateLimitExceeded(
      rate,
      'Too many report attempts. Please try again later.'
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'You must be logged in to report comments.' },
      { status: 401 }
    );
  }

  let body: { comment_id?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const commentId = Number(body.comment_id);

  if (!Number.isInteger(commentId) || commentId < 1) {
    return NextResponse.json({ error: 'Invalid comment_id.' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { data: comment, error: fetchError } = await admin
    .from('comments')
    .select('id, reported, verified')
    .eq('id', commentId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { error: 'Could not fetch comment.' },
      { status: 500 }
    );
  }

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }

  if (comment.verified === true) {
    const response = NextResponse.json({
      ok: true,
      reported: false,
      ignored: true,
      reason: 'verified',
    });

    applyRateLimitHeaders(response, rate);
    return response;
  }

  if (comment.reported === true) {
    const response = NextResponse.json({
      ok: true,
      reported: true,
      ignored: false,
      alreadyReported: true,
    });

    applyRateLimitHeaders(response, rate);
    return response;
  }

  const { error: updateError } = await admin
    .from('comments')
    .update({ reported: true })
    .eq('id', commentId)
    .eq('verified', false);

  if (updateError) {
    return NextResponse.json(
      { error: 'Could not report comment.' },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    reported: true,
    ignored: false,
  });

  applyRateLimitHeaders(response, rate);
  return response;
}

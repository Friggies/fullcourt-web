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

const REACTIONS = ['like', 'love', 'funny', 'fire'] as const;

type ReactionType = (typeof REACTIONS)[number];

type DbReaction = {
  id: number;
  created_at: string;
  comment_id: number;
  author_id: string;
  type: ReactionType;
};

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

function emptyReactionCounts(): Record<ReactionType, number> {
  return {
    like: 0,
    love: 0,
    funny: 0,
    fire: 0,
  };
}

async function getReactionState(commentId: number, viewerId: string) {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from('reactions')
    .select('id, created_at, comment_id, author_id, type')
    .eq('comment_id', commentId);

  if (error) {
    throw new Error('Could not fetch reactions.');
  }

  const reaction_counts = emptyReactionCounts();
  let viewer_reaction: ReactionType | null = null;

  for (const reaction of (data ?? []) as DbReaction[]) {
    if (REACTIONS.includes(reaction.type)) {
      reaction_counts[reaction.type] += 1;
    }

    if (reaction.author_id === viewerId) {
      viewer_reaction = reaction.type;
    }
  }

  return {
    reaction_counts,
    viewer_reaction,
  };
}

export async function POST(req: Request) {
  const rate = await limitByIp(req, rateLimiters.reactionToggle);

  if (!rate.success) {
    return rateLimitExceeded(
      rate,
      'Too many reaction attempts. Please try again later.'
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'You must be logged in to react.' },
      { status: 401 }
    );
  }

  let body: { comment_id?: unknown; type?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const commentId = Number(body.comment_id);
  const type = typeof body.type === 'string' ? body.type : '';

  if (!Number.isInteger(commentId) || commentId < 1) {
    return NextResponse.json({ error: 'Invalid comment_id.' }, { status: 400 });
  }

  if (!REACTIONS.includes(type as ReactionType)) {
    return NextResponse.json(
      { error: 'Invalid reaction type.' },
      { status: 400 }
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from('reactions')
    .select('id, type')
    .eq('comment_id', commentId)
    .eq('author_id', user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: 'Could not check existing reaction.' },
      { status: 500 }
    );
  }

  if (existing?.type === type) {
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id)
      .eq('author_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Could not remove reaction.' },
        { status: 500 }
      );
    }

    const state = await getReactionState(commentId, user.id);

    const response = NextResponse.json({
      ok: true,
      action: 'removed',
      comment_id: commentId,
      ...state,
    });

    applyRateLimitHeaders(response, rate);
    return response;
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id)
      .eq('author_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Could not replace reaction.' },
        { status: 500 }
      );
    }
  }

  const { error: insertError } = await supabase.from('reactions').insert({
    comment_id: commentId,
    author_id: user.id,
    type,
  });

  if (insertError) {
    return NextResponse.json(
      { error: 'Could not save reaction.' },
      { status: 500 }
    );
  }

  const state = await getReactionState(commentId, user.id);

  const response = NextResponse.json({
    ok: true,
    action: existing ? 'changed' : 'created',
    comment_id: commentId,
    ...state,
  });

  applyRateLimitHeaders(response, rate);
  return response;
}

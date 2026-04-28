import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimiters } from '@/lib/upstash';
import {
  applyRateLimitHeaders,
  limitByIp,
  rateLimitExceeded,
} from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
} from '@/components/features/Comment/types';

const REACTIONS = ['like', 'love', 'funny', 'fire'] as const;

type ReactionType = (typeof REACTIONS)[number];

type DbComment = {
  id: number;
  created_at: string;
  reported: boolean;
  verified: boolean;
  page_type: string;
  page_id: number;
  author_id: string;
  content: string;
};

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
            // This can happen in Server Components.
            // Route handlers can set cookies, so this is safe here.
          }
        },
      },
    }
  );
}

function getIp(req: Request) {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    undefined
  );
}

function isValidPageType(value: string) {
  return /^[a-z0-9_-]{1,40}$/i.test(value);
}

function parsePageId(value: FormDataEntryValue | string | null) {
  const raw = typeof value === 'string' ? value : '';
  const pageId = Number(raw);

  if (!Number.isInteger(pageId) || pageId < 1 || pageId > 32767) {
    return null;
  }

  return pageId;
}

function emptyReactionCounts(): Record<ReactionType, number> {
  return {
    like: 0,
    love: 0,
    funny: 0,
    fire: 0,
  };
}

function shapeComments(
  comments: DbComment[],
  reactions: DbReaction[],
  viewerId?: string | null
) {
  const reactionState = new Map<
    number,
    {
      reaction_counts: Record<ReactionType, number>;
      viewer_reaction: ReactionType | null;
    }
  >();

  for (const comment of comments) {
    reactionState.set(comment.id, {
      reaction_counts: emptyReactionCounts(),
      viewer_reaction: null,
    });
  }

  for (const reaction of reactions) {
    const state = reactionState.get(reaction.comment_id);

    if (!state) continue;

    if (REACTIONS.includes(reaction.type)) {
      state.reaction_counts[reaction.type] += 1;
    }

    if (viewerId && reaction.author_id === viewerId) {
      state.viewer_reaction = reaction.type;
    }
  }

  return comments.map(comment => ({
    ...comment,
    ...(reactionState.get(comment.id) ?? {
      reaction_counts: emptyReactionCounts(),
      viewer_reaction: null,
    }),
  }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageType = searchParams.get('page_type');
  const pageId = searchParams.get('page_id');
  const authorId = searchParams.get('author_id');

  if (!authorId && (!pageType || !pageId)) {
    return NextResponse.json(
      { error: 'Provide author_id or both page_type and page_id.' },
      { status: 400 }
    );
  }

  if (pageType && !isValidPageType(pageType)) {
    return NextResponse.json({ error: 'Invalid page_type.' }, { status: 400 });
  }

  const parsedPageId = pageId ? parsePageId(pageId) : null;

  if (pageId && parsedPageId === null) {
    return NextResponse.json({ error: 'Invalid page_id.' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('comments')
    .select(
      'id, created_at, reported, verified, page_type, page_id, author_id, content'
    )
    .order('created_at', { ascending: true });

  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  if (pageType && parsedPageId !== null) {
    query = query.eq('page_type', pageType).eq('page_id', parsedPageId);
  }

  const { data: comments, error: commentsError } = await query;

  if (commentsError) {
    return NextResponse.json(
      { error: 'Could not fetch comments.' },
      { status: 500 }
    );
  }

  const typedComments = (comments ?? []) as DbComment[];
  const commentIds = typedComments.map(comment => comment.id);

  if (commentIds.length === 0) {
    return NextResponse.json({ comments: [] });
  }

  const { data: reactions, error: reactionsError } = await supabase
    .from('reactions')
    .select('id, created_at, comment_id, author_id, type')
    .in('comment_id', commentIds);

  if (reactionsError) {
    return NextResponse.json(
      { error: 'Could not fetch reactions.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    comments: shapeComments(
      typedComments,
      (reactions ?? []) as DbReaction[],
      user?.id
    ),
  });
}

export async function POST(req: Request) {
  const rate = await limitByIp(req, rateLimiters.commentSubmit);

  if (!rate.success) {
    return rateLimitExceeded(
      rate,
      'Too many comment attempts. Please try again later.'
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'You must be logged in to comment.' },
      { status: 401 }
    );
  }

  let form: FormData;

  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form body.' }, { status: 400 });
  }

  const pageType =
    typeof form.get('page_type') === 'string'
      ? String(form.get('page_type')).trim()
      : '';

  const pageId = parsePageId(form.get('page_id'));

  const content =
    typeof form.get('content') === 'string'
      ? String(form.get('content')).trim()
      : '';

  const turnstileToken =
    typeof form.get('cf-turnstile-response') === 'string'
      ? String(form.get('cf-turnstile-response')).trim()
      : '';

  if (!isValidPageType(pageType)) {
    return NextResponse.json({ error: 'Invalid page_type.' }, { status: 400 });
  }

  if (pageId === null) {
    return NextResponse.json({ error: 'Invalid page_id.' }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json(
      { error: 'Comment is required.' },
      { status: 400 }
    );
  }

  if (content.length < COMMENT_MIN_LENGTH) {
    return NextResponse.json(
      {
        error: `Comment must be at least ${COMMENT_MIN_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  if (content.length > COMMENT_MAX_LENGTH) {
    return NextResponse.json(
      {
        error: `Comment must be ${COMMENT_MAX_LENGTH} characters or less.`,
      },
      { status: 400 }
    );
  }

  if (!turnstileToken) {
    return NextResponse.json(
      { error: 'Missing verification token.' },
      { status: 400 }
    );
  }

  const turnstile = await verifyTurnstileToken({
    token: turnstileToken,
    ip: getIp(req),
  });

  if (!turnstile.success) {
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 400 }
    );
  }

  if (turnstile.action && turnstile.action !== 'comment_submit') {
    return NextResponse.json(
      { error: 'Invalid verification action.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      page_type: pageType,
      page_id: pageId,
      author_id: user.id,
      content,
      reported: false,
      verified: false,
    })
    .select(
      'id, created_at, reported, verified, page_type, page_id, author_id, content'
    )
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You have already commented on this page.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Could not create comment.' },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    comment: {
      ...(data as DbComment),
      reaction_counts: emptyReactionCounts(),
      viewer_reaction: null,
    },
  });

  applyRateLimitHeaders(response, rate);
  return response;
}

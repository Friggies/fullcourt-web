import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimiters } from '@/lib/upstash';
import {
  applyRateLimitHeaders,
  limitByIp,
  rateLimitExceeded,
} from '@/lib/rate-limit';

type RouteContext = {
  params: Promise<{
    commentId: string;
  }>;
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
            // Route handlers can set cookies. This is safe here.
          }
        },
      },
    }
  );
}

function parseCommentId(value: string) {
  const commentId = Number(value);

  if (!Number.isInteger(commentId) || commentId < 1 || commentId > 2147483647) {
    return null;
  }

  return commentId;
}

export async function DELETE(req: Request, context: RouteContext) {
  const rate = await limitByIp(req, rateLimiters.commentSubmit);

  if (!rate.success) {
    return rateLimitExceeded(
      rate,
      'Too many delete attempts. Please try again later.'
    );
  }

  const { commentId: rawCommentId } = await context.params;
  const commentId = parseCommentId(rawCommentId);

  if (commentId === null) {
    return NextResponse.json({ error: 'Invalid comment id.' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'You must be logged in to delete comments.' },
      { status: 401 }
    );
  }

  const { data: comment, error: commentError } = await supabase
    .from('comments')
    .select('id, author_id')
    .eq('id', commentId)
    .single();

  if (commentError || !comment) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }

  if (comment.author_id !== user.id) {
    return NextResponse.json(
      { error: 'You can only delete your own comments.' },
      { status: 403 }
    );
  }

  const { error: deleteError } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: 'Could not delete comment.' },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    deleted: true,
    comment_id: commentId,
  });

  applyRateLimitHeaders(response, rate);
  return response;
}

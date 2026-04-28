'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
import { getClientApiError } from '@/lib/client-rate-limit';
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
  type CommentWithReactions,
  type ReactionType,
  type Status,
} from './types';
import { emptyReactionCounts } from './utils';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type UseCommentListOptions = {
  pageType: string;
  pageId: number;
  authorId?: string;
};

export function useCommentList({
  pageType,
  pageId,
  authorId,
}: UseCommentListOptions) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [comments, setComments] = useState<CommentWithReactions[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const [reactionLoadingByComment, setReactionLoadingByComment] = useState<
    Partial<Record<number, ReactionType>>
  >({});

  const [deletingCommentIds, setDeletingCommentIds] = useState<Set<number>>(
    () => new Set()
  );

  const cooldownTimeoutRef = useRef<number | null>(null);

  const hasOwnCommentOnThisPage = useMemo(() => {
    if (!user) return false;

    return comments.some(
      comment =>
        comment.author_id === user.id &&
        comment.page_type === pageType &&
        comment.page_id === pageId
    );
  }, [comments, pageId, pageType, user]);

  const fetchComments = useCallback(async () => {
    setIsCommentsLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (authorId) {
      params.set('author_id', authorId);
    } else {
      params.set('page_type', pageType);
      params.set('page_id', String(pageId));
    }

    try {
      const res = await fetch(`/api/comment?${params.toString()}`, {
        credentials: 'same-origin',
        headers: {
          'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
        },
      });

      if (!res.ok) {
        const apiError = await getClientApiError(
          res,
          'Could not load comments.'
        );

        setError(apiError.message);
        return;
      }

      const data = (await res.json()) as {
        comments?: CommentWithReactions[];
      };

      setComments(data.comments ?? []);
    } catch {
      setError('Network error. Could not load comments.');
    } finally {
      setIsCommentsLoading(false);
    }
  }, [authorId, pageId, pageType]);

  const startCooldown = useCallback((retryAfterMs: number) => {
    if (cooldownTimeoutRef.current !== null) {
      window.clearTimeout(cooldownTimeoutRef.current);
    }

    setIsCoolingDown(true);

    cooldownTimeoutRef.current = window.setTimeout(() => {
      setIsCoolingDown(false);
      cooldownTimeoutRef.current = null;
    }, retryAfterMs);
  }, []);

  const resetTurnstile = useCallback(() => {
    setTurnstileKey(current => current + 1);
  }, []);

  const updateContent = useCallback(
    (nextContent: string) => {
      setContent(nextContent);

      if (status !== 'loading') {
        setStatus('idle');
      }
    },
    [status]
  );

  const submitComment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!user || !session) {
        setStatus('error');
        setError('Only logged in users can comment.');
        return;
      }

      if (hasOwnCommentOnThisPage) {
        setStatus('error');
        setError('You have already commented on this page.');
        return;
      }

      if (isCoolingDown) {
        setStatus('error');
        setError('Please wait a bit before trying again.');
        return;
      }

      const trimmed = content.trim();

      if (!trimmed) {
        setStatus('error');
        setError('Please write a comment first.');
        return;
      }

      if (trimmed.length < COMMENT_MIN_LENGTH) {
        setStatus('error');
        setError(`Comment must be at least ${COMMENT_MIN_LENGTH} characters.`);
        return;
      }

      if (trimmed.length > COMMENT_MAX_LENGTH) {
        setStatus('error');
        setError(`Comment must be ${COMMENT_MAX_LENGTH} characters or less.`);
        return;
      }

      const form = new FormData(event.currentTarget);

      form.set('page_type', pageType);
      form.set('page_id', String(pageId));
      form.set('content', trimmed);

      const token = form.get('cf-turnstile-response');

      if (typeof token !== 'string' || !token.trim()) {
        setStatus('error');
        setError('Please complete the verification first.');
        return;
      }

      setStatus('loading');
      setError(null);

      try {
        const res = await fetch('/api/comment', {
          method: 'POST',
          body: form,
          credentials: 'same-origin',
          headers: {
            'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
          },
        });

        resetTurnstile();

        if (!res.ok) {
          const apiError = await getClientApiError(
            res,
            'Could not post comment.'
          );

          if (apiError.isRateLimited && apiError.retryAfterMs) {
            startCooldown(apiError.retryAfterMs);
          }

          setError(apiError.message);
          setStatus('error');
          return;
        }

        const data = (await res.json()) as {
          comment?: CommentWithReactions;
        };

        if (data.comment) {
          setComments(prev => [...prev, data.comment!]);
        } else {
          await fetchComments();
        }

        setContent('');
        setStatus('ok');
      } catch {
        resetTurnstile();
        setError('Network error. Please try again.');
        setStatus('error');
      }
    },
    [
      content,
      fetchComments,
      hasOwnCommentOnThisPage,
      isCoolingDown,
      pageId,
      pageType,
      resetTurnstile,
      session,
      startCooldown,
      user,
    ]
  );

  const toggleReaction = useCallback(
    async (commentId: number, type: ReactionType) => {
      if (!user || !session) {
        setError('Only logged in users can react.');
        return;
      }

      if (isCoolingDown) {
        setError('Please wait a bit before trying again.');
        return;
      }

      if (reactionLoadingByComment[commentId]) {
        return;
      }

      setError(null);
      setReactionLoadingByComment(prev => ({
        ...prev,
        [commentId]: type,
      }));

      try {
        const res = await fetch('/api/reaction', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
          },
          body: JSON.stringify({
            comment_id: commentId,
            type,
          }),
        });

        if (!res.ok) {
          const apiError = await getClientApiError(
            res,
            'Could not update reaction.'
          );

          if (apiError.isRateLimited && apiError.retryAfterMs) {
            startCooldown(apiError.retryAfterMs);
          }

          setError(apiError.message);
          return;
        }

        const data = (await res.json()) as {
          comment_id: number;
          reaction_counts: Record<ReactionType, number>;
          viewer_reaction: ReactionType | null;
        };

        setComments(prev =>
          prev.map(comment =>
            comment.id === data.comment_id
              ? {
                  ...comment,
                  reaction_counts:
                    data.reaction_counts ?? emptyReactionCounts(),
                  viewer_reaction: data.viewer_reaction,
                }
              : comment
          )
        );
      } catch {
        setError('Network error. Could not update reaction.');
      } finally {
        setReactionLoadingByComment(prev => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
      }
    },
    [isCoolingDown, reactionLoadingByComment, session, startCooldown, user]
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!user || !session) {
        setError('Only logged in users can delete comments.');
        return;
      }

      if (isCoolingDown) {
        setError('Please wait a bit before trying again.');
        return;
      }

      const comment = comments.find(item => item.id === commentId);

      if (!comment) {
        setError('Comment not found.');
        return;
      }

      if (comment.author_id !== user.id) {
        setError('You can only delete your own comments.');
        return;
      }

      const confirmed = window.confirm(
        'Delete this comment? This cannot be undone.'
      );

      if (!confirmed) return;

      setError(null);
      setDeletingCommentIds(prev => new Set(prev).add(commentId));

      try {
        const res = await fetch(`/api/comment/${commentId}`, {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: {
            'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
          },
        });

        if (!res.ok) {
          const apiError = await getClientApiError(
            res,
            'Could not delete comment.'
          );

          if (apiError.isRateLimited && apiError.retryAfterMs) {
            startCooldown(apiError.retryAfterMs);
          }

          setError(apiError.message);
          return;
        }

        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } catch {
        setError('Network error. Could not delete comment.');
      } finally {
        setDeletingCommentIds(prev => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    },
    [comments, isCoolingDown, session, startCooldown, user]
  );

  const reportComment = useCallback(
    async (commentId: number) => {
      if (!user || !session) {
        setError('Only logged in users can report comments.');
        return;
      }

      if (isCoolingDown) {
        setError('Please wait a bit before trying again.');
        return;
      }

      setError(null);

      const comment = comments.find(item => item.id === commentId);

      if (comment?.author_id === user.id) {
        setError('You cannot report your own comment.');
        return;
      }

      try {
        const res = await fetch('/api/comment/report', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
          },
          body: JSON.stringify({
            comment_id: commentId,
          }),
        });

        if (!res.ok) {
          const apiError = await getClientApiError(
            res,
            'Could not report comment.'
          );

          if (apiError.isRateLimited && apiError.retryAfterMs) {
            startCooldown(apiError.retryAfterMs);
          }

          setError(apiError.message);
          return;
        }

        const data = (await res.json()) as {
          reported?: boolean;
          ignored?: boolean;
          reason?: string;
        };

        if (data.reported) {
          setComments(prev =>
            prev.map(comment =>
              comment.id === commentId
                ? { ...comment, reported: true }
                : comment
            )
          );
        }

        if (data.ignored && data.reason === 'verified') {
          setError('This comment has been verified and cannot be reported.');
        }
      } catch {
        setError('Network error. Could not report comment.');
      }
    },
    [comments, isCoolingDown, session, startCooldown, user]
  );

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setSession(session);
      setUser(user ?? null);
      setIsAuthLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (cooldownTimeoutRef.current !== null) {
        window.clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    user,
    comments,
    content,
    status,
    error,
    isAuthLoading,
    isCommentsLoading,
    isCoolingDown,
    turnstileKey,
    reactionLoadingByComment,
    deletingCommentIds,
    hasOwnCommentOnThisPage,

    fetchComments,
    updateContent,
    submitComment,
    toggleReaction,
    deleteComment,
    reportComment,
  };
}

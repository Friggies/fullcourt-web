'use client';

import { useMemo, useState } from 'react';
import type { CommentListProps, CommentSort } from './types';
import { useCommentList } from './useCommentList';
import { sortComments } from './utils';
import { CommentListHeader } from './CommentListHeader';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';

export function CommentList({
  pageType,
  pageId,
  authorId,
  className = '',
  showComposer,
}: CommentListProps) {
  const shouldShowComposer = showComposer ?? !authorId;

  const [sortBy, setSortBy] = useState<CommentSort>('newest');

  const {
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
  } = useCommentList({
    pageType,
    pageId,
    authorId,
  });

  const sortedComments = useMemo(() => {
    return sortComments(comments, sortBy);
  }, [comments, sortBy]);

  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <CommentListHeader
        count={comments.length}
        isLoading={isCommentsLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={fetchComments}
      />

      {shouldShowComposer && (
        <CommentComposer
          user={user}
          userId={user?.id ?? null}
          isAuthLoading={isAuthLoading}
          hasOwnCommentOnThisPage={hasOwnCommentOnThisPage}
          content={content}
          status={status}
          error={error}
          isCoolingDown={isCoolingDown}
          turnstileKey={turnstileKey}
          onContentChange={updateContent}
          onSubmit={submitComment}
        />
      )}

      {!shouldShowComposer && error && (
        <div aria-live="polite" className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isCommentsLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          sortedComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id ?? null}
              isAuthLoading={isAuthLoading}
              isCoolingDown={isCoolingDown}
              pendingReaction={reactionLoadingByComment[comment.id]}
              isDeleting={deletingCommentIds.has(comment.id)}
              onToggleReaction={toggleReaction}
              onDelete={deleteComment}
              onReport={reportComment}
            />
          ))
        )}
      </div>
    </section>
  );
}

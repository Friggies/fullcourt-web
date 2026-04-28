import type { CommentWithReactions, ReactionType } from './types';
import { formatDate } from './utils';
import { CommentReactionBar } from './CommentReactionBar';

type CommentItemProps = {
  comment: CommentWithReactions;
  currentUserId: string | null;
  isAuthLoading: boolean;
  isCoolingDown: boolean;
  pendingReaction?: ReactionType;
  isDeleting: boolean;
  onToggleReaction: (commentId: number, type: ReactionType) => void;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
};

export function CommentItem({
  comment,
  currentUserId,
  isAuthLoading,
  isCoolingDown,
  pendingReaction,
  isDeleting,
  onToggleReaction,
  onDelete,
  onReport,
}: CommentItemProps) {
  const isOwnComment = comment.author_id === currentUserId;
  const canReact = Boolean(currentUserId);

  return (
    <article className="rounded border p-4">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          {isOwnComment && <span className="font-medium">You</span>}

          <time
            dateTime={comment.created_at}
            className="text-muted-foreground text-xs"
          >
            {isOwnComment && ' - '}
            {formatDate(comment.created_at)}
          </time>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {comment.verified && (
            <span className="rounded border px-2 py-1 text-green-700">
              Verified
            </span>
          )}

          {comment.reported && !comment.verified && (
            <span className="rounded border px-2 py-1 text-orange-700">
              Reported
            </span>
          )}
        </div>
      </header>

      <p className="whitespace-pre-wrap break-words text-sm leading-6">
        {comment.content}
      </p>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <CommentReactionBar
          comment={comment}
          canReact={canReact}
          isCoolingDown={isCoolingDown}
          pendingReaction={pendingReaction}
          onToggleReaction={onToggleReaction}
        />

        {!isAuthLoading &&
          (isOwnComment ? (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="text-xs underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReport(comment.id)}
              disabled={!currentUserId || comment.reported || comment.verified}
              className="text-xs underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {comment.reported
                ? 'Reported'
                : comment.verified
                  ? 'Verified'
                  : 'Report'}
            </button>
          ))}
      </footer>
    </article>
  );
}

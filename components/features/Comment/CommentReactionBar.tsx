import {
  REACTIONS,
  type CommentWithReactions,
  type ReactionType,
} from './types';

type CommentReactionBarProps = {
  comment: CommentWithReactions;
  canReact: boolean;
  isCoolingDown: boolean;
  pendingReaction?: ReactionType;
  onToggleReaction: (commentId: number, type: ReactionType) => void;
};

export function CommentReactionBar({
  comment,
  canReact,
  isCoolingDown,
  pendingReaction,
  onToggleReaction,
}: CommentReactionBarProps) {
  const isReactionPending = Boolean(pendingReaction);

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(reaction => {
        const active = comment.viewer_reaction === reaction.type;
        const count = comment.reaction_counts?.[reaction.type] ?? 0;
        const isThisReactionPending = pendingReaction === reaction.type;

        return (
          <button
            key={reaction.type}
            type="button"
            onClick={() => onToggleReaction(comment.id, reaction.type)}
            disabled={!canReact || isCoolingDown || isReactionPending}
            aria-pressed={active}
            aria-busy={isThisReactionPending}
            title={canReact ? reaction.label : 'Log in to react to comments'}
            className={`rounded border px-2.5 py-1 text-sm disabled:opacity-60 ${
              active ? 'bg-black text-white' : ''
            }`}
          >
            <span aria-hidden="true">{reaction.emoji}</span>{' '}
            <span>{isThisReactionPending ? '…' : count}</span>
          </button>
        );
      })}
    </div>
  );
}

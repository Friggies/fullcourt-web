import {
  CommentSort,
  REACTIONS,
  type CommentWithReactions,
  type ReactionType,
} from './types';

export function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function emptyReactionCounts(): Record<ReactionType, number> {
  return {
    like: 0,
    love: 0,
    funny: 0,
    fire: 0,
  };
}

export function getTotalReactions(comment: CommentWithReactions) {
  return REACTIONS.reduce((total, reaction) => {
    return total + (comment.reaction_counts?.[reaction.type] ?? 0);
  }, 0);
}

export function sortComments(
  comments: CommentWithReactions[],
  sortBy: CommentSort
) {
  return [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    if (sortBy === 'oldest') {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    const reactionDifference = getTotalReactions(b) - getTotalReactions(a);

    if (reactionDifference !== 0) {
      return reactionDifference;
    }

    // Tie-breaker for popular: newer comments first.
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

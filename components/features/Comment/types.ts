export const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'funny', emoji: '😂', label: 'Funny' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
] as const;

export type ReactionType = (typeof REACTIONS)[number]['type'];

export type CommentWithReactions = {
  id: number;
  created_at: string;
  reported: boolean;
  verified: boolean;
  page_type: string;
  page_id: number;
  author_id: string;
  content: string;
  reaction_counts: Record<ReactionType, number>;
  viewer_reaction: ReactionType | null;
};

export type CommentListProps = {
  pageType: string;
  pageId: number;
  authorId?: string;
  className?: string;
  showComposer?: boolean;
};

export type Status = 'idle' | 'loading' | 'ok' | 'error';

export type CommentSort = 'newest' | 'oldest' | 'popular';

export const COMMENT_MIN_LENGTH = 10;

export const COMMENT_MAX_LENGTH = 1000;

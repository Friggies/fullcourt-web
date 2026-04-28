import type { FormEvent } from 'react';
import { TurnstileWidget } from '@/components/common/Turnstile';
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH, type Status } from './types';
import AuthButtons from '@/components/common/AuthButtons';
import { User } from '@supabase/supabase-js';

type CommentComposerProps = {
  user: User | null;
  userId: string | null;
  isAuthLoading: boolean;
  hasOwnCommentOnThisPage: boolean;
  content: string;
  status: Status;
  error: string | null;
  isCoolingDown: boolean;
  turnstileKey: number;
  onContentChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CommentComposer({
  user,
  userId,
  isAuthLoading,
  hasOwnCommentOnThisPage,
  content,
  status,
  error,
  isCoolingDown,
  turnstileKey,
  onContentChange,
  onSubmit,
}: CommentComposerProps) {
  const trimmedLength = content.trim().length;
  const remainingUntilMinimum = Math.max(COMMENT_MIN_LENGTH - trimmedLength, 0);
  const isTooShort = trimmedLength > 0 && trimmedLength < COMMENT_MIN_LENGTH;

  return (
    <div className="rounded border p-4">
      {isAuthLoading ? (
        <p className="text-sm text-muted-foreground">Checking login status…</p>
      ) : userId ? (
        hasOwnCommentOnThisPage ? (
          <p className="text-sm text-muted-foreground">
            You have already commented on this page.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Add a comment</span>

              <textarea
                name="content"
                required
                maxLength={COMMENT_MAX_LENGTH}
                value={content}
                onChange={event => onContentChange(event.target.value)}
                disabled={status === 'loading' || isCoolingDown}
                placeholder="Write a comment…"
                className="min-h-24 rounded border bg-white px-3 py-2 text-base text-black disabled:opacity-60"
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                {trimmedLength}/{COMMENT_MAX_LENGTH}
              </span>
              {isTooShort && (
                <p className="text-xs text-red-600">
                  Write {remainingUntilMinimum} more{' '}
                  {remainingUntilMinimum === 1 ? 'character' : 'characters'}.
                </p>
              )}
            </div>

            <TurnstileWidget key={turnstileKey} action="comment_submit" />

            <button
              type="submit"
              disabled={
                status === 'loading' ||
                isCoolingDown ||
                trimmedLength < COMMENT_MIN_LENGTH ||
                trimmedLength > COMMENT_MAX_LENGTH
              }
              className="rounded border px-4 py-2 disabled:opacity-60"
            >
              {status === 'loading'
                ? 'Posting…'
                : isCoolingDown
                  ? 'Please wait…'
                  : 'Post comment'}
            </button>
          </form>
        )
      ) : (
        <div className="text-sm text-muted-foreground flex flex-col gap-4">
          <p>Only logged in users can comment.</p>
          <div className="flex flex-row gap-4">
            <AuthButtons initialUser={!!user} />
          </div>
        </div>
      )}

      <div aria-live="polite" className="mt-3 text-sm">
        {status === 'ok' && (
          <span className="text-green-600">Comment posted.</span>
        )}

        {error && <span className="text-red-600">{error}</span>}
      </div>
    </div>
  );
}

import { LoaderIcon } from 'lucide-react';
import type { CommentSort } from './types';

type CommentListHeaderProps = {
  count: number;
  isLoading: boolean;
  sortBy: CommentSort;
  onSortChange: (sortBy: CommentSort) => void;
  onRefresh: () => void;
};

export function CommentListHeader({
  count,
  isLoading,
  sortBy,
  onSortChange,
  onRefresh,
}: CommentListHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">Comments</h2>
        <p className="text-sm text-muted-foreground">
          {count === 1 ? '1 comment' : `${count} comments`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label>
          <span className="sr-only">Sort comments</span>

          <select
            value={sortBy}
            onChange={event => onSortChange(event.target.value as CommentSort)}
            className="h-8 rounded border bg-background px-3 text-sm leading-5 font-[inherit]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex h-8 min-w-[76px] items-center justify-center rounded border px-3 text-sm leading-5 font-[inherit] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Refreshing comments</span>
            </>
          ) : (
            'Refresh'
          )}
        </button>
      </div>
    </div>
  );
}

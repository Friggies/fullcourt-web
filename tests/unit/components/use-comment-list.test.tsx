import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import type { Session, User } from '@supabase/supabase-js';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  })),
}));

jest.mock('@/lib/client-rate-limit', () => ({
  getClientApiError: jest.fn(),
}));

import { createBrowserClient } from '@supabase/ssr';
import { getClientApiError } from '@/lib/client-rate-limit';
import { useCommentList } from '@/components/features/Comment/useCommentList';
import type {
  CommentWithReactions,
  ReactionType,
} from '@/components/features/Comment/types';

const mockSupabaseClient = (createBrowserClient as jest.Mock).mock.results[0]
  .value;

const mockGetSession = mockSupabaseClient.auth.getSession as jest.Mock;
const mockGetUser = mockSupabaseClient.auth.getUser as jest.Mock;
const mockOnAuthStateChange = mockSupabaseClient.auth
  .onAuthStateChange as jest.Mock;

const mockGetClientApiError = getClientApiError as jest.Mock;

const mockUnsubscribe = jest.fn();

const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
} as User;

const mockSession = {
  user: mockUser,
  access_token: 'access-token',
} as Session;

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

function makeComment(
  overrides: Partial<CommentWithReactions> = {}
): CommentWithReactions {
  return {
    id: 1,
    page_type: 'drill',
    page_id: 42,
    author_id: 'other-user',
    content: 'This is a test comment.',
    reaction_counts: {
      like: 0,
    } as unknown as Record<ReactionType, number>,
    viewer_reaction: null,
    reported: false,
    ...overrides,
  } as CommentWithReactions;
}

function makeSubmitEvent(token = 'turnstile-token') {
  const form = document.createElement('form');

  const turnstileInput = document.createElement('input');
  turnstileInput.name = 'cf-turnstile-response';
  turnstileInput.value = token;

  form.appendChild(turnstileInput);

  return {
    preventDefault: jest.fn(),
    currentTarget: form,
  } as unknown as FormEvent<HTMLFormElement>;
}

async function renderCommentListHook(
  options: {
    pageType?: string;
    pageId?: number;
    authorId?: string;
  } = {}
) {
  const rendered = renderHook(() =>
    useCommentList({
      pageType: options.pageType ?? 'drill',
      pageId: options.pageId ?? 42,
      authorId: options.authorId,
    })
  );

  await waitFor(() => {
    expect(rendered.result.current.isAuthLoading).toBe(false);
  });

  await waitFor(() => {
    expect(rendered.result.current.isCommentsLoading).toBe(false);
  });

  return rendered;
}

beforeEach(() => {
  jest.clearAllMocks();

  process.env.NEXT_DEPLOYMENT_ID = 'test-deployment';

  global.fetch = jest.fn().mockResolvedValue(jsonResponse({ comments: [] }));

  mockGetSession.mockResolvedValue({
    data: {
      session: mockSession,
    },
  });

  mockGetUser.mockResolvedValue({
    data: {
      user: mockUser,
    },
  });

  mockOnAuthStateChange.mockReturnValue({
    data: {
      subscription: {
        unsubscribe: mockUnsubscribe,
      },
    },
  });

  mockGetClientApiError.mockResolvedValue({
    message: 'Request failed.',
    isRateLimited: false,
  });

  Object.defineProperty(window, 'confirm', {
    writable: true,
    value: jest.fn(() => true),
  });
});

test('loads comments for a page on mount', async () => {
  // Arrange
  const comment = makeComment();

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    jsonResponse({
      comments: [comment],
    })
  );

  // Act
  const { result } = await renderCommentListHook();

  // Assert
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/comment?page_type=drill&page_id=42',
    expect.objectContaining({
      credentials: 'same-origin',
      headers: {
        'x-deployment-id': 'test-deployment',
      },
    })
  );

  expect(result.current.comments).toEqual([comment]);
  expect(result.current.error).toBeNull();
});

test('loads comments by author when authorId is provided', async () => {
  // Arrange
  const authorComment = makeComment({
    author_id: 'author-1',
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    jsonResponse({
      comments: [authorComment],
    })
  );

  // Act
  const { result } = await renderCommentListHook({
    authorId: 'author-1',
  });

  // Assert
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/comment?author_id=author-1',
    expect.any(Object)
  );

  expect(result.current.comments).toEqual([authorComment]);
});

test('shows an error when comments fail to load', async () => {
  // Arrange
  mockGetClientApiError.mockResolvedValueOnce({
    message: 'Could not load comments from API.',
    isRateLimited: false,
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, false));

  // Act
  const { result } = await renderCommentListHook();

  // Assert
  expect(result.current.error).toBe('Could not load comments from API.');
  expect(result.current.isCommentsLoading).toBe(false);
});

test('updates comment content and resets non-loading status to idle', async () => {
  // Arrange
  const { result } = await renderCommentListHook();

  await act(async () => {
    await result.current.submitComment(makeSubmitEvent());
  });

  expect(result.current.status).toBe('error');

  // Act
  act(() => {
    result.current.updateContent('This is a valid comment.');
  });

  // Assert
  expect(result.current.content).toBe('This is a valid comment.');
  expect(result.current.status).toBe('idle');
});

test('does not submit when turnstile token is missing', async () => {
  // Arrange
  const { result } = await renderCommentListHook();

  act(() => {
    result.current.updateContent('This is a valid comment.');
  });

  // Act
  await act(async () => {
    await result.current.submitComment(makeSubmitEvent(''));
  });

  // Assert
  expect(result.current.status).toBe('error');
  expect(result.current.error).toBe('Please complete the verification first.');
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('submits a valid comment and appends the returned comment', async () => {
  // Arrange
  const createdComment = makeComment({
    id: 2,
    author_id: 'user-1',
    content: 'This is a valid comment.',
  });

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(jsonResponse({ comments: [] }))
    .mockResolvedValueOnce(
      jsonResponse({
        comment: createdComment,
      })
    );

  const { result } = await renderCommentListHook();

  act(() => {
    result.current.updateContent('  This is a valid comment.  ');
  });

  // Act
  await act(async () => {
    await result.current.submitComment(makeSubmitEvent('turnstile-token'));
  });

  // Assert
  expect(global.fetch).toHaveBeenCalledTimes(2);

  const postCall = (global.fetch as jest.Mock).mock.calls[1];
  const postUrl = postCall[0];
  const postOptions = postCall[1];
  const body = postOptions.body as FormData;

  expect(postUrl).toBe('/api/comment');
  expect(postOptions).toEqual(
    expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'x-deployment-id': 'test-deployment',
      },
    })
  );

  expect(body.get('page_type')).toBe('drill');
  expect(body.get('page_id')).toBe('42');
  expect(body.get('content')).toBe('This is a valid comment.');

  expect(result.current.comments).toEqual([createdComment]);
  expect(result.current.content).toBe('');
  expect(result.current.status).toBe('ok');
  expect(result.current.turnstileKey).toBe(1);
});

test('does not submit when the user already commented on the same page', async () => {
  // Arrange
  const ownComment = makeComment({
    id: 3,
    author_id: 'user-1',
    page_type: 'drill',
    page_id: 42,
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    jsonResponse({
      comments: [ownComment],
    })
  );

  const { result } = await renderCommentListHook();

  act(() => {
    result.current.updateContent('This is another valid comment.');
  });

  // Act
  await act(async () => {
    await result.current.submitComment(makeSubmitEvent());
  });

  // Assert
  expect(result.current.hasOwnCommentOnThisPage).toBe(true);
  expect(result.current.status).toBe('error');
  expect(result.current.error).toBe('You have already commented on this page.');
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('toggles a reaction and updates the matching comment', async () => {
  // Arrange
  const comment = makeComment({
    id: 10,
  });

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      jsonResponse({
        comments: [comment],
      })
    )
    .mockResolvedValueOnce(
      jsonResponse({
        comment_id: 10,
        reaction_counts: {
          like: 1,
        },
        viewer_reaction: 'like',
      })
    );

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.toggleReaction(10, 'like' as ReactionType);
  });

  // Assert
  expect(global.fetch).toHaveBeenCalledTimes(2);

  const reactionCall = (global.fetch as jest.Mock).mock.calls[1];
  const reactionUrl = reactionCall[0];
  const reactionOptions = reactionCall[1];

  expect(reactionUrl).toBe('/api/reaction');
  expect(reactionOptions).toEqual(
    expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-deployment-id': 'test-deployment',
      },
    })
  );

  expect(JSON.parse(reactionOptions.body)).toEqual({
    comment_id: 10,
    type: 'like',
  });

  expect(result.current.comments[0].viewer_reaction).toBe('like');
  expect(result.current.comments[0].reaction_counts).toEqual({
    like: 1,
  });
  expect(result.current.reactionLoadingByComment[10]).toBeUndefined();
});

test('does not react when the user is logged out', async () => {
  // Arrange
  mockGetSession.mockResolvedValueOnce({
    data: {
      session: null,
    },
  });

  mockGetUser.mockResolvedValueOnce({
    data: {
      user: null,
    },
  });

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.toggleReaction(1, 'like' as ReactionType);
  });

  // Assert
  expect(result.current.error).toBe('Only logged in users can react.');
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('deletes an owned comment after confirmation', async () => {
  // Arrange
  const ownComment = makeComment({
    id: 15,
    author_id: 'user-1',
  });

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      jsonResponse({
        comments: [ownComment],
      })
    )
    .mockResolvedValueOnce(jsonResponse({ deleted: true }));

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.deleteComment(15);
  });

  // Assert
  expect(window.confirm).toHaveBeenCalledWith(
    'Delete this comment? This cannot be undone.'
  );

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/comment/15',
    expect.objectContaining({
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'x-deployment-id': 'test-deployment',
      },
    })
  );

  expect(result.current.comments).toEqual([]);
  expect(result.current.deletingCommentIds.has(15)).toBe(false);
});

test('does not delete another users comment', async () => {
  // Arrange
  const otherComment = makeComment({
    id: 20,
    author_id: 'other-user',
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    jsonResponse({
      comments: [otherComment],
    })
  );

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.deleteComment(20);
  });

  // Assert
  expect(result.current.error).toBe('You can only delete your own comments.');
  expect(window.confirm).not.toHaveBeenCalled();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('reports another users comment and marks it as reported', async () => {
  // Arrange
  const otherComment = makeComment({
    id: 25,
    author_id: 'other-user',
    reported: false,
  });

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce(
      jsonResponse({
        comments: [otherComment],
      })
    )
    .mockResolvedValueOnce(
      jsonResponse({
        reported: true,
      })
    );

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.reportComment(25);
  });

  // Assert
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/comment/report',
    expect.objectContaining({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-deployment-id': 'test-deployment',
      },
      body: JSON.stringify({
        comment_id: 25,
      }),
    })
  );

  expect(result.current.comments[0].reported).toBe(true);
});

test('does not allow a user to report their own comment', async () => {
  // Arrange
  const ownComment = makeComment({
    id: 30,
    author_id: 'user-1',
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce(
    jsonResponse({
      comments: [ownComment],
    })
  );

  const { result } = await renderCommentListHook();

  // Act
  await act(async () => {
    await result.current.reportComment(30);
  });

  // Assert
  expect(result.current.error).toBe('You cannot report your own comment.');
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

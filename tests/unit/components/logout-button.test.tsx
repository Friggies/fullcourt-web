import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoutButton } from '@/components/logout-button';

let mockPush: jest.Mock;
let mockSignOut: jest.Mock;

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
  }),
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  }),
}));

beforeEach(() => {
  mockPush = jest.fn();
  mockSignOut = jest.fn().mockResolvedValue({ error: null });
});

test('logs out and navigates to /auth/login', async () => {
  const user = userEvent.setup();
  render(<LogoutButton />);

  await user.click(screen.getByRole('button', { name: 'Logout' }));

  await waitFor(() => {
    expect(mockSignOut).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});

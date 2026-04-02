import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/login-form';
import type { ReactNode, AnchorHTMLAttributes } from 'react';

let mockPush: jest.Mock;
let mockSignInWithPassword: jest.Mock;

type LinkMockProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => mockPush(...args),
  }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: LinkMockProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: (...args: unknown[]) =>
        mockSignInWithPassword(...args),
    },
  }),
}));

beforeEach(() => {
  mockPush = jest.fn();
  mockSignInWithPassword = jest.fn();
});

test('logs in and navigates to /profile on success', async () => {
  const user = userEvent.setup();
  mockSignInWithPassword.mockResolvedValue({ error: null });
  render(<LoginForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(
    screen.getByLabelText('Password'),
    'correct-horse-battery-staple'
  );
  await user.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'correct-horse-battery-staple',
    });
  });

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });
});

test('shows loading state while logging in', async () => {
  const user = userEvent.setup();
  let resolveAuth: (value: { error: Error | null }) => void = () => {};

  mockSignInWithPassword.mockImplementation(
    () =>
      new Promise<{ error: Error | null }>(resolve => {
        resolveAuth = resolve;
      })
  );

  render(<LoginForm />);
  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'pw');
  const submit = screen.getByRole('button', { name: 'Login' });

  await user.click(submit);

  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: 'Logging in...' })
    ).toBeDisabled();
  });

  resolveAuth({ error: null });

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled();
  });
});

test('shows an error message when Supabase login fails', async () => {
  const user = userEvent.setup();
  mockSignInWithPassword.mockResolvedValue({
    error: new Error('Invalid login credentials'),
  });
  render(<LoginForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'wrong');
  await user.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
  });

  expect(mockPush).not.toHaveBeenCalled();
});

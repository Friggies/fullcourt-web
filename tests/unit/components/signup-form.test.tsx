import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '@/components/sign-up-form';
import type { ReactNode, AnchorHTMLAttributes } from 'react';

let mockPush: jest.Mock;
let mockSignUp: jest.Mock;

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
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  }),
}));

beforeEach(() => {
  mockPush = jest.fn();
  mockSignUp = jest.fn();
});

test('prevents sign up when passwords do not match', async () => {
  const user = userEvent.setup();
  render(<SignUpForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'pw-1');
  await user.type(screen.getByLabelText('Repeat Password'), 'pw-2');
  await user.click(screen.getByRole('button', { name: 'Sign up' }));

  expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  expect(mockSignUp).not.toHaveBeenCalled();
  expect(mockPush).not.toHaveBeenCalled();
});

test('signs up and navigates to /auth/sign-up-success on success', async () => {
  const user = userEvent.setup();
  mockSignUp.mockResolvedValue({ error: null });
  render(<SignUpForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'pw');
  await user.type(screen.getByLabelText('Repeat Password'), 'pw');
  await user.click(screen.getByRole('button', { name: 'Sign up' }));

  await waitFor(() => {
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'pw',
      options: {
        emailRedirectTo: expect.stringContaining('/profile'),
      },
    });
  });

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/auth/sign-up-success');
  });
});

test('shows an error message when Supabase sign up fails', async () => {
  const user = userEvent.setup();
  mockSignUp.mockResolvedValue({
    error: new Error('Email already registered'),
  });
  render(<SignUpForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'pw');
  await user.type(screen.getByLabelText('Repeat Password'), 'pw');
  await user.click(screen.getByRole('button', { name: 'Sign up' }));

  await waitFor(() => {
    expect(screen.getByText('Email already registered')).toBeInTheDocument();
  });

  expect(mockPush).not.toHaveBeenCalled();
});

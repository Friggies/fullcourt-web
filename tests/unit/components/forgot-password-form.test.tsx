import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import type { ReactNode, AnchorHTMLAttributes } from 'react';

let mockResetPasswordForEmail: jest.Mock;

type LinkMockProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

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
      resetPasswordForEmail: (...args: unknown[]) =>
        mockResetPasswordForEmail(...args),
    },
  }),
}));

beforeEach(() => {
  mockResetPasswordForEmail = jest.fn();
});

test('submits reset password request and shows success state', async () => {
  const user = userEvent.setup();
  mockResetPasswordForEmail.mockResolvedValue({ error: null });
  render(<ForgotPasswordForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.click(screen.getByRole('button', { name: 'Send reset email' }));

  await waitFor(() => {
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
      redirectTo: expect.stringContaining('/auth/update-password'),
    });
  });

  await waitFor(() => {
    expect(screen.getByText('Check Your Email')).toBeInTheDocument();
  });
});

test('shows an error when reset password fails', async () => {
  const user = userEvent.setup();
  mockResetPasswordForEmail.mockResolvedValue({
    error: new Error('Reset password failed'),
  });
  render(<ForgotPasswordForm />);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.click(screen.getByRole('button', { name: 'Send reset email' }));

  await waitFor(() => {
    expect(screen.getByText('Reset password failed')).toBeInTheDocument();
  });
});

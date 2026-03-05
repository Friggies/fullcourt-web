import { ForgotPasswordForm } from '@/components/forgot-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your FULLCOURT TRAINING account password.',
  alternates: { canonical: '/auth/forgot-password' },
  robots: { index: false, follow: false },
  openGraph: {
    url: '/auth/forgot-password',
    title: 'Forgot Password | FULLCOURT TRAINING',
    description: 'Reset your FULLCOURT TRAINING account password.',
  },
  twitter: {
    title: 'Forgot Password | FULLCOURT TRAINING',
    description: 'Reset your FULLCOURT TRAINING account password.',
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

import { LoginForm } from '@/components/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your FULLCOURT TRAINING account.',
  alternates: { canonical: '/auth/login' },
  robots: { index: false, follow: false },
  openGraph: {
    url: '/auth/login',
    title: 'Log In | FULLCOURT TRAINING',
    description: 'Log in to your FULLCOURT TRAINING account.',
  },
  twitter: {
    title: 'Log In | FULLCOURT TRAINING',
    description: 'Log in to your FULLCOURT TRAINING account.',
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

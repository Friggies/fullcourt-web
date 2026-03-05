import { SignUpForm } from '@/components/sign-up-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your FULLCOURT TRAINING account.',
  alternates: { canonical: '/auth/sign-up' },
  robots: { index: false, follow: false },
  openGraph: {
    url: '/auth/sign-up',
    title: 'Sign Up | FULLCOURT TRAINING',
    description: 'Create your FULLCOURT TRAINING account.',
  },
  twitter: {
    title: 'Sign Up | FULLCOURT TRAINING',
    description: 'Create your FULLCOURT TRAINING account.',
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}

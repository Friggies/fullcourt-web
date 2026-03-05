import { UpdatePasswordForm } from '@/components/update-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Update your FULLCOURT TRAINING account password.',
  alternates: { canonical: '/auth/update-password' },
  robots: { index: false, follow: false },
  openGraph: {
    url: '/auth/update-password',
    title: 'Update Password | FULLCOURT TRAINING',
    description: 'Update your FULLCOURT TRAINING account password.',
  },
  twitter: {
    title: 'Update Password | FULLCOURT TRAINING',
    description: 'Update your FULLCOURT TRAINING account password.',
  },
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}

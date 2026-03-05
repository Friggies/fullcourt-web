import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Something Went Wrong',
  description: 'An unexpected error occurred. Please try again.',
  alternates: { canonical: '/auth/error' },
  robots: { index: false, follow: false },
  openGraph: {
    url: '/auth/error',
    title: 'Something Went Wrong | FULLCOURT TRAINING',
    description: 'An unexpected error occurred. Please try again.',
  },
  twitter: {
    title: 'Something Went Wrong | FULLCOURT TRAINING',
    description: 'An unexpected error occurred. Please try again.',
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import DrillGrid from '@/components/features/Drill/DrillGrid';
import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { createClient } from '@/lib/supabase/server';
import { CrownIcon } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drills and Plays',
  description: 'Browse animated basketball drills and plays.',
  alternates: { canonical: '/drills' },
  openGraph: {
    url: '/drills',
    title: 'Drills | FULLCOURT TRAINING',
    description: 'Browse animated basketball drills and plays.',
  },
};

export default async function Drills() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPremium = false;

  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('premium')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && profile?.premium) {
      isPremium = true;
    }
  }

  return (
    <>
      <Hero title="All Drills & Plays" />
      <DrillGrid />

      {!isPremium && (
        <Section>
          <div className="my-4 w-full text-gray-500 flex flex-col items-center text-center">
            <CrownIcon className="mb-2" />
            <p>Looking for more drills and plays?</p>
            <Link className="text-lg underline" href="/pricing">
              Become a premium member&nbsp;now
            </Link>
          </div>
        </Section>
      )}
    </>
  );
}

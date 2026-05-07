import DrillGrid from '@/components/features/Drill/DrillGrid';
import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { createClient } from '@/lib/supabase/server';
import { LockIcon } from 'lucide-react';
import { Metadata } from 'next';
import { getStatsDrills } from '@/lib/stats-drills';
import Button from '@/components/common/Button';

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
  const { premiumCount } = await getStatsDrills();

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
          <div className="my-6 w-full rounded-2xl border-2 border-brand1 px-5 py-6 text-center shadow-sm">
            <LockIcon className="mx-auto mb-3 h-7 w-7 text-brand1" />

            <h3 className="text-xl font-semibold">
              Want the Full Premium Playbook?
            </h3>

            <p className="mx-auto my-1 max-w-sm text-sm text-muted-foreground">
              Unlock {premiumCount} additional premium drills and plays today,
              plus every new drill and play we add in the future.
            </p>

            <Button className="mt-3" variant="fill" href="/pricing">
              Upgrade to Premium
            </Button>
          </div>
        </Section>
      )}
    </>
  );
}

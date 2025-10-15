import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { InfoIcon } from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';
import { Hero } from '@/components/hero';
import { Section } from '@/components/section';

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('premium')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile error:', profileError);
    redirect('/auth/login');
  }

  return (
    <>
      <Hero title="Your Profile" />
      <Section>
        <div className="bg-accent border text-sm p-3 px-5 rounded-md flex gap-3 items-center mt-4">
          <InfoIcon size={16} strokeWidth={2} />
          {profile.premium
            ? 'You are a Premium user'
            : 'You are on the free plan'}
        </div>
        <LogoutButton />
      </Section>
    </>
  );
}

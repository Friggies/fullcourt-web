import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { DownloadIcon, InfoIcon } from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';
import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import { ManageSubscriptionButton } from '@/components/atoms/ManageSubscriptionButton';
import Button from '@/components/atoms/Button';

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
        {!profile.premium && (
          <div className="bg-accent border text-sm p-10 rounded-md flex gap-3 items-center mt-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-center">
              Upgrade your account to access premium drills and plays
            </h2>
          </div>
        )}
        <ManageSubscriptionButton
          appUserId={user.id}
          rcPublicApiKey="rcb_sb_OGKLWxTmlOtsmlZhZcvWheQNQ"
          fallbackPurchaseUrl="https://pay.rev.cat/sandbox/gnqbyhrpeqigvbxp/"
        />
        <div className="bg-accent border rounded-md p-10 gap-10 grid grid-cols-1 sm:grid-cols-2">
          <div></div>
          <div className="flex flex-col">
            <h2 className="text-xl lg:text-2xl font-semibold">
              Easily save drill and plays on our mobile app
            </h2>
            <p className="mb-5 text-muted-foreground">
              Our mobile app gives you a native experience when browsing though
              all our animated drills and plays. Furthermore, it enables you to
              easily save both drills and plays, making it easy to organize for
              success.
            </p>
            <Button>
              Download now <DownloadIcon size={16} />
            </Button>
          </div>
        </div>
        <LogoutButton />
      </Section>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from './Button';

export default function AuthButtons({ initialUser }: { initialUser: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialUser);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoggedIn) {
    return (
      <>
        <Button href="/profile">Profile</Button>
      </>
    );
  }

  return (
    <>
      <Button href="/auth/login" variant="outline">
        Login
      </Button>
      <Button href="/auth/sign-up" variant="fill">
        Get Started
      </Button>
    </>
  );
}

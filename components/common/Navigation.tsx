'use client';

import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Button from './Button';
import MobileMenu from './MobileMenu';

export default function Navigation() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const pathname = usePathname();

  const links = [
    { href: '/drills', label: 'Playbook' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ];

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        setUser(data.user ?? null);
      } catch {
        if (!active) return;
        setUser(null);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav className="p-4 mx-auto border-b border-b-foreground/10 bg-background sticky top-0 z-40">
        <div className="max-w-3xl w-full flex gap-4 justify-end items-center mx-auto">
          <Link className="mr-auto" href="/" aria-label="Go to homepage">
            <Image
              src="/images/logo.webp"
              alt="Fullcourt Training Logo"
              width={1000}
              height={934}
              loading="eager"
              sizes="(min-width: 640px) 200px, 100px"
              className="h-[40px] sm:h-[60px] w-auto object-contain pointer-events-none"
            />
          </Link>

          <div className="hidden sm:flex gap-4 font-normal align-middle items-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            {user === undefined ? (
              <LoaderIcon className="animate-spin" />
            ) : user ? (
              <Button href="/profile">Profile</Button>
            ) : (
              <>
                <Button href="/auth/login">Login</Button>
                <Button href="/auth/sign-up" variant="fill">
                  Get Started
                </Button>
              </>
            )}

            <MobileMenu key={pathname} links={links} />
          </div>
        </div>
      </nav>
    </>
  );
}

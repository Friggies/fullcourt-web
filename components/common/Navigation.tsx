'use client';

import { LoaderIcon, MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ThemeSwitcher } from '../theme-switcher';
import Image from 'next/image';
import { SoMe } from './Some';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import Button from './Button';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(undefined);

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

  const pathname = usePathname();

  const links = [
    { href: '/drills', label: 'Playbook' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

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

            <button onClick={() => setIsOpen(o => !o)} className="sm:hidden">
              <MenuIcon size={30} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 flex ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`
            w-full h-full bg-background p-4
            transform transition-transform duration-300 ease-in-out flex flex-col gap-4 motion-reduce:duration-0
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <button onClick={() => setIsOpen(false)} className="ml-auto">
            <XIcon size={30} />
          </button>

          <nav className="flex flex-col gap-4 font-normal items-start">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-lg font-black uppercase"
            >
              Fullcourt Training
            </Link>

            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex gap-2 items-center">
              <ThemeSwitcher />
              <SoMe />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

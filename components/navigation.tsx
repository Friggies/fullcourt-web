'use client';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ThemeSwitcher } from './theme-switcher';
import Image from 'next/image';
import { SoMe } from './some';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
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
          <Link className="mr-auto" href="/">
            <Image
              src={'/images/logo.webp'}
              alt="Fullcourt Training Logo"
              priority
              width={1000}
              height={934}
              className="h-[40px] sm:h-[60px] w-auto object-contain"
            />
          </Link>
          <div className="hidden sm:flex gap-4 font-normal align-middle items-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={'hover:underline'}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <Link
                href="/profile"
                className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded border border-primary hover:bg-accent hover:text-accent-foreground transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  Get Started Free
                </Link>
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
              href={'/'}
              onClick={() => setIsOpen(false)}
              className="text-lg font-black uppercase"
            >
              Fullcourt Training
            </Link>
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={'hover:underline'}
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon } from 'lucide-react';
import { ThemeSwitcher } from '../theme-switcher';
import { SoMe } from './Some';

type LinkItem = {
  href: string;
  label: string;
};

export default function MobileMenu({ links }: { links: LinkItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(o => !o)} className="sm:hidden">
        <MenuIcon size={30} />
      </button>

      <div
        className={`fixed inset-0 z-50 flex ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`
            w-full h-full bg-background p-4
            transform transition-transform duration-300 ease-in-out
            flex flex-col gap-4 motion-reduce:duration-0
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
                onClick={() => setIsOpen(false)}
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

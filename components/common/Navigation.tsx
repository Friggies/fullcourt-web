import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import MobileMenu from '@/components/common/MobileMenu';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

const links = [
  { href: '/drills', label: 'Playbook' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export default async function Navigation() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
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
          <NavLinks links={links} />
        </div>

        <div className="flex gap-4 items-center">
          <AuthButtons initialUser={!!user} />
          <MobileMenu links={links} />
        </div>
      </div>
    </nav>
  );
}

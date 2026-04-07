'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map(link => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? 'underline' : 'hover:underline'}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

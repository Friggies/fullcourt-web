import Button from '../atoms/Button';
import { ThemeSwitcher } from '../theme-switcher';
import { SoMe } from '../some';
import Link from 'next/link';
import { MailIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="p-4 border-t border-t-foreground/10">
      <div className="max-w-3xl mx-auto flex flex-col gap-5 items-start mt-4">
        <div>
          <Link href="/" className="font-black uppercase">
            Fullcourt Training
          </Link>
          <p>Animated Basketball Drills and Plays for Players and Coaches</p>
        </div>
        <Button href="mailto:contact@fullcourt-training.com">
          Contact Us <MailIcon size={16} strokeWidth={1.5} />
        </Button>
        <div className="flex gap-3">
          <ThemeSwitcher />
          <SoMe />
        </div>
        <p className="text-sm text-muted-foreground uppercase font-black">
          &copy; {new Date().getFullYear()} Fullcourt Training
        </p>
      </div>
    </footer>
  );
}

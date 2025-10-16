import DrillsGrid from '@/components/drills-grid';
import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import { CrownIcon } from 'lucide-react';
import Link from 'next/link';

export default function Drills() {
  return (
    <>
      <Hero title="All Drills & Plays" />
      <DrillsGrid />
      <Section>
        <div className="my-4 w-full text-gray-500 flex flex-col items-center text-center">
          <CrownIcon className="mb-2" />
          <p>Looking for more drills and plays?</p>
          <Link className="text-lg underline" href={'/pricing'}>
            Become a premium member&nbsp;now
          </Link>
        </div>
      </Section>
    </>
  );
}

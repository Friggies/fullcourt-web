import { B2BDisclaimer } from '@/components/b2b-disclaimer';
import DrillsGrid from '@/components/drills-grid';
import { Hero } from '@/components/hero';
import { CrownIcon } from 'lucide-react';
import Link from 'next/link';

export default function Drills() {
  return (
    <>
      <Hero title="All Drills" />
      <DrillsGrid />
      <div className="my-4 text-gray-500 flex flex-col items-center text-center">
        <CrownIcon className="mb-2" />
        <p>Looking for more animated drills?</p>
        <Link className="text-lg underline" href={'/profile'}>
          Become a premium member&nbsp;today
        </Link>
      </div>
      <B2BDisclaimer />
    </>
  );
}

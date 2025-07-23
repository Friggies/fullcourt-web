import DrillsGrid from '@/components/drills-grid';
import { Hero } from '@/components/hero';
import { CrownIcon, UsersIcon } from 'lucide-react';
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
      <div className="border shadow-sm rounded-lg p-4 bg-accent flex flex-col items-center text-center">
        <UsersIcon className="mb-2" />
        <p className="text-lg font-semibold">Are you a club or organization?</p>
        <p>
          Check out{' '}
          <Link className="underline" href={'/b2b'}>
            B2B
          </Link>{' '}
          to learn more about custom animations
        </p>
      </div>
    </>
  );
}

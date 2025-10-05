import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { Section } from './section';

export function B2BDisclaimer() {
  return (
    <Section>
      <div className="m-auto border shadow-sm rounded-lg p-4 bg-accent flex flex-col items-center text-center">
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
    </Section>
  );
}

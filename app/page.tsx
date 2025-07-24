import { B2BDisclaimer } from '@/components/b2b-disclaimer';
import { Hero } from '@/components/hero';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'FULLCOURT TRAINING',
  description: '',
};

export default function Index() {
  return (
    <>
      <Image
        src={'/animations/passing.gif'}
        alt="Fun Passing Animation"
        unoptimized
        priority
        width={1080}
        height={1080}
        className="h-[150px] w-auto mx-auto mt-10 mb-5 animate-spin-slow"
      />
      <Hero title="Animated basketball drills for&nbsp;the&nbsp;entire&nbsp;court" />
      <B2BDisclaimer />
    </>
  );
}

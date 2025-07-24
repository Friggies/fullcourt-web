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
      <div>
        <div className="relative h-[250px] w-[250px] mx-auto rounded-lg border shadow-sm overflow-hidden flex items-center justify-center">
          <Image
            src={'/images/floor.webp'}
            alt="Floor Plan"
            priority
            width={1080}
            height={1080}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <Image
            src={'/animations/passing.gif'}
            alt="Fun Passing Animation"
            unoptimized
            priority
            width={1080}
            height={1080}
            className="h-[150px] w-auto  animate-spin-slow"
          />
        </div>
      </div>
      <Hero title="Animated basketball drills for&nbsp;the&nbsp;entire&nbsp;court" />
      <B2BDisclaimer />
    </>
  );
}

import { B2BDisclaimer } from '@/components/b2b-disclaimer';
import { Hero } from '@/components/hero';
import some from '@/data/some';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FULLCOURT TRAINING',
  description: '',
};

export default function Index() {
  const { totalFollowers, totalViews } = some.reduce(
    (acc, cur) => ({
      totalFollowers: acc.totalFollowers + cur.followers,
      totalViews: acc.totalViews + cur.views,
    }),
    { totalFollowers: 0, totalViews: 0 }
  );

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
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-xl font-semibold">Follow Us on Social Media</h2>
        <div className="flex flex-col sm:flex-row w-full gap-4">
          <div className="flex flex-1 flex-col text-center justify-center items-center">
            <span className="text-5xl">+{totalFollowers}</span>
            <span>Followers</span>
          </div>
          <div className="flex flex-1 flex-row items-center justify-center gap-4">
            {some.map(some => (
              <Link
                target="_blank"
                key={some.name}
                href={some.link}
                className="w-12 h-12 p-2 rounded-full border-[2px] border-black flex items-center content-center"
                style={{ backgroundColor: '#333399' }}
              >
                <Image
                  className="w-full h-auto object-cover"
                  src={`/images/${some.name}.webp`}
                  alt={`${some.name} Logo`}
                  width={some.image.width}
                  height={some.image.height}
                />
              </Link>
            ))}
          </div>
          <div className="flex flex-1 flex-col text-center justify-center items-center">
            <span className="text-5xl">+{totalViews}</span>
            <span>Views</span>
          </div>
        </div>
      </div>
      <B2BDisclaimer />
    </>
  );
}

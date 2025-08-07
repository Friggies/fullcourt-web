import { B2BDisclaimer } from '@/components/b2b-disclaimer';
import { Hero } from '@/components/hero';
import { Line } from '@/components/line';
import { SoMe } from '@/components/some';
import some from '@/data/some';
import { DownloadIcon, TelescopeIcon } from 'lucide-react';
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
      <div className="mb-[-1rem] relative sm:h-[250px] h-[150px] rounded-lg border shadow-sm overflow-hidden flex items-center justify-center">
        <Image
          src={'/images/floor.webp'}
          alt="Floor Plan"
          priority
          width={1600}
          height={1013}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <Image
          src={'/images/lines.png'}
          alt="Floor Plan"
          priority
          width={1600}
          height={1013}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <Image
          src={'/animations/passing.gif'}
          alt="Fun Passing Animation"
          unoptimized
          priority
          width={1080}
          height={1080}
          className="h-[100px] sm:h-[150px] w-auto  animate-spin-slow"
        />
      </div>
      <Hero title="Animated basketball drills for&nbsp;the&nbsp;entire&nbsp;court" />
      <div className="flex flex-col-reverse sm:flex-row-reverse gap-10 items-center">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <h2 className="flex flex-col text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase">About us</span>
            <span className="font-semibold text-xl lg:text-2xl">
              A modern basketball&nbsp;playbook
            </span>
          </h2>
          <p className="text-justify">
            We help players and coaches visualize and practice various
            basketball plays and movements. With an extensive library of drills,
            users can easily find and follow along with animations that
            demonstrate proper techniques and strategies.
          </p>
          <Link
            href="/drills"
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Explore the playbook now
            <TelescopeIcon size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <Image
          className="aspect-[9/16] w-full sm:w-auto h-[150px] sm:h-[300px] object-contain"
          src={'/images/logo.webp'}
          width={1000}
          height={1778}
          alt="Tactical board of Pass & Cut drill (5 out)"
        />
      </div>
      <Line />
      <div className="flex flex-col items-center text-center gap-5">
        <h2 className="text-xl font-semibold">
          Team up with us on social&nbsp;media
        </h2>
        <div className="flex flex-col sm:flex-row w-full gap-5">
          <div className="flex flex-1 flex-col text-center justify-center items-center">
            <span className="text-5xl flex gap-2">{totalFollowers}</span>
            <span>Followers</span>
          </div>
          <SoMe />
          <div className="flex flex-1 flex-col text-center justify-center items-center">
            <span className="text-5xl flex gap-2">{totalViews}</span>
            <span>Views</span>
          </div>
        </div>
      </div>
      <Line />
      <div className="flex flex-col sm:flex-row gap-10 items-center">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <h2 className="flex flex-col text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase">
              The app experience
            </span>
            <span className="font-semibold text-xl lg:text-2xl">
              A playbook in your pocket
            </span>
          </h2>
          <p className="text-justify">
            Our app is designed to provide a seamless experience for players and
            coaches. With a user-friendly interface, you can easily access our
            library of drills and access a digital tactical board right on your
            phone.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Download the app now
            <DownloadIcon size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <Image
          className="aspect-[9/16] w-full sm:w-auto sm:h-[400px] border rounded-lg shadow-sm"
          src={'/thumbnails/3.webp'}
          width={1000}
          height={1778}
          alt="Tactical board of Pass & Cut drill (5 out)"
        />
      </div>
      <B2BDisclaimer />
    </>
  );
}

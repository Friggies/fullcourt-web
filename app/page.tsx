import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Court } from '@/components/atoms/Court';
import { FAQ } from '@/components/faq';
import { Line } from '@/components/line';
import { Newsletter } from '@/components/newsletter';
import { Section } from '@/components/section';
import { SoMe } from '@/components/some';
import Testimonials from '@/components/testimonials';
import some from '@/data/some';
import { StarIcon } from 'lucide-react';
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
      <Court>
        <Card>
          <h1 className="text-2xl lg:text-3xl font-semibold">
            Animated Basketball Drills
          </h1>
          <p>
            Easily visualize, understand and practice complex basketball plays
            with our animated drills.
          </p>
          <Line />
          <Button href="/drills">Explore Playbook</Button>
        </Card>
        <Image
          src={'/animations/passing.gif'}
          alt="Fun Passing Animation"
          unoptimized
          priority
          width={1080}
          height={1080}
          className="h-[100px] sm:h-[150px] w-auto animate-spin-slow"
        />
      </Court>
      <Section className="bg-muted py-3 text-muted-foreground mb-10">
        <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-1">
          <span className="whitespace-nowrap">Used by</span>
          <span className="flex -space-x-2">
            {[
              '/images/avatars/marcus_lin.jpeg',
              '/images/avatars/luca_bennett.jpeg',
              '/images/avatars/ray_donovan.jpeg',
              '/images/avatars/eli_torres.jpeg',
              '/images/avatars/tariq_adams.jpeg',
              '/images/avatars/chris_walker.jpeg',
            ].map((src, i, arr) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={40}
                height={40}
                className="relative h-10 w-10 object-cover rounded-full border border-muted"
                style={{ zIndex: arr.length - i }}
              />
            ))}
          </span>
          <span className="w-full text-center sm:w-auto sm:text-left whitespace-nowrap">
            and +{totalFollowers} other players and coaches
          </span>
        </div>
      </Section>
      <Section>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Image
            className="w-full h-[150px] object-contain m-auto"
            src={'/images/logo.webp'}
            width={1000}
            height={1778}
            alt="Tactical board of Pass & Cut drill (5 out)"
          />
          <div className="col-span-2 sm:px-4 flex flex-col gap-2">
            <h2 className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase">About us</span>
              <span className="font-semibold text-xl lg:text-2xl">
                A Modern Basketball&nbsp;Playbook Loved and Used by Thousands
              </span>
            </h2>
            <p>
              We help players and coaches visualize and practice various
              basketball plays and movements. With an extensive library of
              drills and plays, users can easily find and follow along with
              animations that demonstrate proper techniques and strategies.
            </p>
          </div>
        </ul>
      </Section>
      <Section>
        <div className="flex flex-col gap-5 items-center">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <li className="flex relative">
              <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-yellow-500 shadow">
                <StarIcon fill="currentColor" size={14} />
                <span className="text-foreground">Highlighted Drill</span>
              </div>
              <Link
                href={`/drills/6`}
                className="relative flex flex-col border rounded-md shadow-sm overflow-hidden"
              >
                <Image
                  src={`/thumbnails/6.webp`}
                  alt={`Play 3-2 X-Screen to Corner`}
                  width={600}
                  height={1067}
                />
                <div className="absolute bottom-0 w-full bg-background/50 backdrop-blur-sm p-4 flex flex-col flex-1 justify-between">
                  <h2 className="text-lg font-semibold">
                    3-2 X-Screen to Corner
                  </h2>
                </div>
              </Link>
            </li>
            <li className="flex relative">
              <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-yellow-500 shadow">
                <StarIcon fill="currentColor" size={14} />
                <span className="text-foreground">Highlighted Drill</span>
              </div>
              <Link
                href={`/drills/5`}
                className="relative flex flex-col border rounded-md shadow-sm overflow-hidden"
              >
                <Image
                  src={`/thumbnails/5.webp`}
                  alt={`Play 3-2 X-Screen to Layup`}
                  width={600}
                  height={1067}
                />
                <div className="absolute bottom-0 w-full bg-background/50 backdrop-blur-sm p-4 flex flex-col flex-1 justify-between">
                  <h2 className="text-lg font-semibold">
                    3-2 X-Screen to Layup
                  </h2>
                </div>
              </Link>
            </li>
            <li className="flex relative">
              <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-yellow-500 shadow">
                <StarIcon fill="currentColor" size={14} />
                <span className="text-foreground">Highlighted Drill</span>
              </div>
              <Link
                href={`/drills/7`}
                className="relative flex flex-col border rounded-md shadow-sm overflow-hidden"
              >
                <Image
                  src={`/thumbnails/7.webp`}
                  alt={`Play 2-3 X-Screen Boomerang to Layup`}
                  width={600}
                  height={1067}
                />
                <div className="absolute bottom-0 w-full bg-background/50 backdrop-blur-sm p-4 flex flex-col flex-1 justify-between">
                  <h2 className="text-lg font-semibold">
                    2-3 X-Screen Boomerang to Layup
                  </h2>
                </div>
              </Link>
            </li>
          </ul>
          <Button href="/drills">Browse all drills and plays</Button>
        </div>
      </Section>
      <Line />
      <Testimonials />
      <Newsletter />
      <Section>
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold w-full text-center">
            Team Up with us on Social&nbsp;Media
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
      </Section>
      <Line />
      <FAQ />
    </>
  );
}

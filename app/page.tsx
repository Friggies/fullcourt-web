import Image from 'next/image';
import type { Metadata } from 'next';
import Button from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Court } from '@/components/common/Court';
import { FAQ } from '@/components/pages/frontpage/faq';
import { Line } from '@/components/common/Line';
import { Newsletter } from '@/components/pages/frontpage/newsletter';
import { Section } from '@/components/common/Section';
import { SoMe } from '@/components/common/Some';
import Testimonials from '@/components/pages/frontpage/testimonials';
import some from '@/data/some';
import DrillCard from '@/components/features/Drilll/DrillCard';
import { HighlightedDrill } from '@/lib/types';

export const metadata: Metadata = {
  title: 'FULLCOURT TRAINING',
  description:
    'Animated basketball drills and playbook for players and coaches.',
};

const Headshots = [
  '/images/avatars/marcus_lin.jpeg',
  '/images/avatars/luca_bennett.jpeg',
  '/images/avatars/ray_donovan.jpeg',
  '/images/avatars/eli_torres.jpeg',
  '/images/avatars/tariq_adams.jpeg',
  '/images/avatars/chris_walker.jpeg',
];

const HighlightedDrills: HighlightedDrill[] = [
  {
    id: 6,
    name: '3-2 X-Screen to Corner',
    categories: ['Attacking 2-3'],
    players: 5,
  },
  {
    id: 5,
    name: '3-2 X-Screen to Layup',
    categories: ['Attacking 2-3'],
    players: 5,
  },
  {
    id: 7,
    name: '2-3 X-Screen Boomerang to Layup',
    categories: ['Attacking 2-3'],
    players: 5,
  },
];

function calculateSoMeTotals(items: typeof some) {
  return items.reduce(
    (acc, cur) => {
      acc.totalFollowers += cur.followers;
      acc.totalViews += cur.views;
      return acc;
    },
    { totalFollowers: 0, totalViews: 0 }
  );
}

const nf = new Intl.NumberFormat('en-US');

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col text-center justify-center items-center">
      <span className="text-5xl flex gap-2">{nf.format(value)}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Index() {
  const { totalFollowers, totalViews } = calculateSoMeTotals(some);

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
          src="/animations/passing.gif"
          alt="Animated passing drill"
          unoptimized
          priority
          width={1080}
          height={1080}
          className="h-[100px] sm:h-[150px] w-auto animate-spin-slow"
        />
      </Court>

      <Section className="bg-muted py-5 text-muted-foreground mb-5">
        <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-1">
          <span className="whitespace-nowrap">Used by</span>

          <span className="flex -space-x-2" aria-label="User headshots">
            {Headshots.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                aria-hidden
                width={40}
                height={40}
                className="relative h-10 w-10 object-cover rounded-full border border-muted"
                style={{ zIndex: Headshots.length - i }}
              />
            ))}
          </span>

          <span className="w-full text-center sm:w-auto sm:text-left whitespace-nowrap">
            and +{nf.format(totalFollowers)} other players and coaches
          </span>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 sm:px-4 flex flex-col gap-2">
            <h2 className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase">About us</span>
              <span className="font-semibold text-xl lg:text-2xl">
                A Digital Basketball Playbook Used by Thousands of Players and
                Coaches
              </span>
            </h2>
            <p>
              We help players and coaches visualize and practice basketball
              plays and movements. With an extensive library of drills, users
              can follow along with animations that demonstrate proper
              techniques and strategies.
            </p>
          </div>
          <Image
            src="/animations/straight_passing.gif"
            alt="Animated passing drill"
            unoptimized
            priority
            width={1080}
            height={270}
            className="sm:animate-spin-slow order-first sm:order-last sm:w-[80%] mx-auto"
          />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-5 items-center">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {HighlightedDrills.map(drill => (
              <DrillCard drill={drill} key={drill.id} />
            ))}
          </ul>
          <Button href="/drills">Browse all Drills and Plays</Button>
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
            <Stat value={totalFollowers} label="Followers" />
            <SoMe />
            <Stat value={totalViews} label="Views" />
          </div>
        </div>
      </Section>

      <Line />
      <FAQ />
    </>
  );
}

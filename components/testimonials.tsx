import * as React from 'react';
import Image from 'next/image';
import { Section } from '@/components/section';
import { StarIcon } from 'lucide-react';

type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  rating?: number;
  avatar?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Coach Miller',
    role: 'Varsity Coach',
    quote:
      'The animated drills make spacing and timing so much easier to teach. Our practices run smoother.',
    rating: 5,
    avatar: '/images/logo.webp',
  },
  {
    name: 'Ava K.',
    role: 'Point Guard',
    quote:
      'Seeing actions play out helped me memorize sets faster. I’m reacting instead of thinking.',
    rating: 4,
    avatar: '/images/logo.webp',
  },
  {
    name: 'Jonas L.',
    role: 'Youth Coach (DK)',
    quote:
      'Great for beginners—my U13s picked up cuts and reads in just a couple of sessions.',
    rating: 5,
    avatar: '/images/logo.webp',
  },
  {
    name: 'Riley S.',
    role: 'Assistant Coach',
    quote:
      'Clear visuals turned our whiteboard sets into something players could actually feel.',
    rating: 5,
    avatar: '/images/logo.webp',
  },
  {
    name: 'Jonas L.',
    role: 'Youth Coach (DK)',
    quote:
      'Great for beginners—my U13s picked up cuts and reads in just a couple of sessions.',
    rating: 5,
    avatar: '/images/logo.webp',
  },
  {
    name: 'Riley S.',
    role: 'Assistant Coach',
    quote:
      'Clear visuals turned our whiteboard sets into something players could actually feel.',
    rating: 4,
    avatar: '/images/logo.webp',
  },
];

function Stars({ value = 5 }: { value?: number }) {
  const rounded = Math.min(5, Math.max(0, Math.ceil(value)));
  const empty = 5 - rounded;

  return (
    <div className="flex items-center" aria-label={`${rounded} out of 5 stars`}>
      {Array.from({ length: rounded }).map((_, i) => (
        <StarIcon
          key={`f${i}`}
          className="h-4 w-4 text-yellow-500"
          fill="currentColor"
          stroke="currentColor"
        />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon
          key={`e${i}`}
          className="h-4 w-4 text-yellow-500"
          fill="none"
          stroke="currentColor"
        />
      ))}
      <span className="sr-only">{rounded} out of 5</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <Section>
      <div className="flex flex-col gap-6 w-full">
        <header className="text-center sm:text-left">
          <span className="text-xs uppercase text-muted-foreground">
            Testimonials
          </span>
          <h2 className="text-xl lg:text-2xl font-semibold">
            Loved by Players & Coaches
          </h2>
        </header>

        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <li key={i} className="flex">
              <figure className="relative flex flex-col rounded-lg border bg-background p-5 shadow-sm">
                <Stars value={t.rating ?? 5} />
                <blockquote className="text-sm leading-relaxed mb-auto">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    {t.role && (
                      <span className="text-xs text-muted-foreground">
                        {t.role}
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

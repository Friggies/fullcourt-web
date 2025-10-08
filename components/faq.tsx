import * as React from 'react';
import { Section } from '@/components/section';

type FaqItem = { q: string; a: string };

const FAQS: FaqItem[] = [
  {
    q: 'Do I need the app to access drills?',
    a: 'No. You can browse drills on the website. The app adds offline access and a pocket tactical board.',
  },
  {
    q: 'Are drills suitable for youth teams?',
    a: 'Yes—each drill lists level guidance and coaching points so you can scale complexity for U10–U18 and seniors.',
  },
  {
    q: 'Can I share drills with my players?',
    a: 'Absolutely. Share links directly or export sets to share in your team chat or LMS.',
  },
  {
    q: 'How often are new drills added?',
    a: 'We add new animations weekly during the season and bi-weekly off-season.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes. You can preview drills and save a few favorites. Pro unlocks full library and team features.',
  },
];
// -----------------------------------------------------------------

export function FAQ() {
  return (
    <Section>
      <div className="flex flex-col gap-6 w-full">
        <header className="text-center sm:text-left">
          <span className="text-xs uppercase text-muted-foreground">FAQ</span>
          <h2 className="text-xl lg:text-2xl font-semibold">
            Common questions
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-lg border bg-background/60 backdrop-blur-sm p-4 open:shadow-sm"
            >
              <summary className="list-none cursor-pointer font-medium flex items-center justify-between">
                <span>{f.q}</span>
                <span className="ml-3 text-muted-foreground transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

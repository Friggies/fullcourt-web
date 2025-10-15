import * as React from 'react';
import { Section } from '@/components/section';
import FAQS from '@/data/faq';

export function FAQ() {
  return (
    <Section>
      <div className="flex flex-col gap-6 w-full">
        <header className="text-center sm:text-left">
          <span className="text-xs uppercase text-muted-foreground">FAQ</span>
          <h2 className="text-xl lg:text-2xl font-semibold">
            Common Questions
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

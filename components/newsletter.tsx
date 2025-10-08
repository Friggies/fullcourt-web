import * as React from 'react';
import { Section } from '@/components/section';

export function Newsletter() {
  return (
    <Section>
      <div className="flex flex-col gap-6 w-full">
        <header className="text-center sm:text-left">
          <span className="text-xs uppercase text-muted-foreground">
            Stay informed
          </span>
          <h2 className="text-xl lg:text-2xl font-semibold">
            Get the newsletter
          </h2>
        </header>
      </div>
    </Section>
  );
}

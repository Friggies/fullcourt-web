import { cn } from '@/lib/utils';
import * as React from 'react';

export function Section({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: string;
}) {
  return (
    <section className={cn('px-4 py-5', style)}>
      <div className={'max-w-3xl m-auto flex gap-5'}>{children}</div>
    </section>
  );
}

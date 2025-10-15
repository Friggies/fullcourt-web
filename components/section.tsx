import { cn } from '@/lib/utils';
import * as React from 'react';

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('px-4 py-5', className)}>
      <div className={'max-w-3xl m-auto flex gap-5 flex-col'}>{children}</div>
    </section>
  );
}

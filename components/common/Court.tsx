import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as React from 'react';

export function Court({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex items-center justify-center',
        className
      )}
    >
      <Image
        src={'/images/floor.webp'}
        alt="Floor Plan"
        priority
        width={1600}
        height={1013}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <Image
        src={'/images/lines.png'}
        alt="Floor Plan"
        priority
        width={1600}
        height={1013}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="max-w-3xl flex flex-col-reverse sm:flex-row items-center gap-0 sm:gap-[100px] px-4 py-[50px]">
        {children}
      </div>
    </div>
  );
}

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
        fill
        className="object-cover z-0"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRvYCAABXRUJQVlA4IOoCAABwPwCdASoVAlIBP/3+/3+/u7u7oLEKO/A/iWlu4IafHcMYuz879cX/8Cm+fAAG2lBvqpBumHUhkIADneVcTg/tolyHmQ48QNvDQKUC3t7dqD1UKQM7gacgH+TxcffPaXHEcvAkDnICMlqWr9NUxNG/6QI/w5Hz4NR9GUTPAY3cE9h/bTTKP9VQnvFG1Ryk7UBe3Z0jNVmodbLCOsT0uEWBZ7CHVTMjjGFrhFHk1uK3VPLIbhACpY4gc75EeWdDIQEQE9CE9juiRIw/xKaXzzoJA8FRj/iawV5VuWaEkDNIQY2AwtMJzGVNXqpiTTnzERpiHtTjVmpfanR+aqYR6qn+MCEB2NqJmq7tyDecLW2OYW6UBjwlDqoDzCHqprj8FRdWH8g21Bg4qQ2G/mEUNMwqlrsRjjyVxrEGi45R2I9WgEYEggD1k3DhD2zjWPmEK9UlrQjLVIP3WN2t2FUYocH82wdVE4MA8CrARYHEf20u+GwGivizOu3CGCJfQdrj7W7UH7+WyPquQO8FS+2lOGnxYN4d4mwySFX9TnTmz6y5Y1vy7Y3lN0pZKVd/ko3beUGMcSoAzGdR5a3+aiWXSGW46s8hASi/jUvhhSYjGdxLp1SCUzVpNYQhxOsbFXbUvXcL4rNRuAiDlESP+x/nCuqUzdw/i5PvB/a9bLBWH6W0vXGLOAAA/qUv3O4IfV7bfAfmQ5GJc4PkeYk95nsEH82IF8AcdROFUKXKifh1w57PujnDZNtXWmm3mBuqy5Xj8pBG1Af1yYYcYvOtHjNYhTQ4sRnnRoLVN5DC8BfUgxu20nZKXUTeikIRkEJ338WjmInyNfv2GFcpH0oyBIuHoj9tGEPgDZ3fxvvqdDoEFWRR+NIowygbloI5uzcyeA8zSnsfcetsFeddpaSZj0nq+2atqyMAb9ME8bjZ2hgjqra+cVXw100PAFxJtweA5Kg1I+JhNekGAVBwTRwVNix77jn5XP1c+a+pHAuAAA=="
      />
      <Image
        src={'/images/lines.png'}
        alt="Floor Plan"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="max-w-3xl flex flex-col-reverse sm:flex-row items-center gap-0 sm:gap-[100px] px-4 py-[50px]">
        {children}
      </div>
    </div>
  );
}

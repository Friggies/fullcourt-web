import * as React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-balance z-10 relative p-4 sm:p-8 max-w-2xl bg-background/50 backdrop-blur-sm flex flex-col gap-2 rounded-lg shadow-md">
      {children}
    </div>
  );
}

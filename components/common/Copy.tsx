import * as React from 'react';

export function Copy() {
  return (
    <p className="text-sm text-muted-foreground uppercase font-black">
      &copy; {new Date().getFullYear()} Fullcourt Training
    </p>
  );
}

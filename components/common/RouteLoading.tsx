import { LoaderIcon } from 'lucide-react';

export function RouteLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <LoaderIcon className="animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

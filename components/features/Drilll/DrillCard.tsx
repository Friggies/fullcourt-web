import { Drill, HighlightedDrill } from '@/lib/types';
import { UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DrillCard({
  drill,
}: {
  drill: Drill | HighlightedDrill;
}) {
  return (
    <li className="flex relative">
      <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-foreground shadow">
        <UsersIcon size={12} />
        {drill.players} players
      </div>
      <Link
        href={`/drills/${drill.id}`}
        className="relative flex flex-col border rounded-md shadow-sm overflow-hidden aspect-[9/16]"
      >
        <Image
          src={`/thumbnails/${drill.id}.webp`}
          alt={`${drill.name} preview`}
          width={600}
          height={400}
          className="object-cover w-full h-auto"
        />
        <div className="absolute bottom-0 w-full bg-background/60 backdrop-blur-sm p-4 flex flex-col">
          <h2 className="text-lg font-semibold">{drill.name}</h2>
          <p className="text-sm">{drill.categories.join(', ')}</p>
        </div>
      </Link>
    </li>
  );
}

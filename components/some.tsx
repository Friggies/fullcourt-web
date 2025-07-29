import some from '@/data/some';
import Image from 'next/image';
import Link from 'next/link';

export function SoMe() {
  return (
    <div className="flex flex-row gap-3 items-center">
      {some.map(some => (
        <Link
          target="_blank"
          key={some.name}
          href={some.link}
          className="p-3 flex rounded-full hover:scale-105 hover:shadow-sm transition-transform duration-300"
          style={{ background: some.backgroundGradient }}
        >
          <Image
            className="h-6 w-6 object-contain"
            src={`/images/${some.name}.webp`}
            alt={`${some.name} Logo`}
            width={some.image.width}
            height={some.image.height}
          />
        </Link>
      ))}
    </div>
  );
}

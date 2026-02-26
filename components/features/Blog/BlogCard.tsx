import { Article } from '@/lib/types';
import { Calendar1Icon, CalendarIcon, HourglassIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogCard({ article }: { article: Article }) {
  return (
    <li className="relative aspect-[16/9]">
      <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-foreground shadow">
        <CalendarIcon size={12} />
        {new Date(article.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        })}
      </div>

      <Link
        href={`/blog/${article.id}`}
        className="relative block w-full h-full border rounded-md shadow-sm overflow-hidden"
      >
        <Image
          src={`https://crbswbfgtbkjinzagblg.supabase.co/storage/v1/object/public/article_thumbnails/${article.title.toLowerCase().replaceAll(' ', '-')}.webp`}
          alt={`${article.title} preview`}
          fill
          className="object-cover"
        />

        <div className="absolute bottom-0 w-full bg-background/60 backdrop-blur-sm p-4">
          <h2 className="text-lg font-semibold">{article.title}</h2>
        </div>
      </Link>
    </li>
  );
}

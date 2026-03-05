import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { ArrowLeftIcon, UsersIcon } from 'lucide-react';

import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { Copy } from '@/components/common/Copy';
import { createClient } from '@/lib/supabase/server';
import type { Drill } from '@/lib/types';
import { stripMarkdown, truncate } from '@/lib/utils';

type Props = { params: Promise<{ id: string }> };

const getDrill = cache(async (id: string) => {
  const supabase = await createClient();

  const { data: drill, error } = await supabase
    .from('drills')
    .select('id,name,type,premium,description,link,players')
    .eq('id', id)
    .maybeSingle<Drill>();

  if (error) throw new Error(error.message);
  return drill ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drill = await getDrill(id);
  if (!drill) notFound();

  const baseDesc = drill.description?.trim()
    ? truncate(stripMarkdown(drill.description), 160)
    : `Animated basketball drill: ${drill.type} for ${drill.players} ${drill.players === 1 ? 'player' : 'players'}.`;

  const ogImage = `/thumbnails/${drill.id}.webp`;

  return {
    title: drill.name,
    description: baseDesc,
    alternates: { canonical: `/drills/${drill.id}` },
    openGraph: {
      type: 'article',
      url: `/drills/${drill.id}`,
      title: drill.name,
      description: baseDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: drill.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: drill.name,
      description: baseDesc,
      images: [ogImage],
    },
  };
}

function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  if (!s.startsWith('http') && /^[a-zA-Z0-9_-]{6,}$/.test(s)) return s;

  try {
    const url = new URL(s);
    const v = url.searchParams.get('v');
    if (v) return v;

    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      return id || null;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    const embedIdx = parts.indexOf('embed');
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];

    return null;
  } catch {
    return null;
  }
}

export default async function DrillPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const drill = await getDrill(id);

  if (!drill) notFound();

  let videoUri: string | null = null;

  if (drill.link?.trim()) {
    videoUri = drill.link.trim();
  } else {
    const { data: signed, error: signedErr } = await supabase.storage
      .from('premium-drills')
      .createSignedUrl(`${drill.id}.mp4`, 60 * 60 * 5);

    videoUri = !signedErr && signed?.signedUrl ? signed.signedUrl : null;
  }

  const youtubeId = videoUri ? extractYouTubeId(videoUri) : null;
  const isYouTube = Boolean(youtubeId);

  return (
    <>
      <Hero title={drill.name} />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 order-1 sm:order-none flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <Link
                className="flex items-center gap-1 underline text-gray-500"
                href="/drills"
              >
                <ArrowLeftIcon size={16} />
                Back to all drills
              </Link>

              <span className="inline-flex gap-1 items-center px-3 py-1 bg-muted text-muted-foreground font-medium rounded-full">
                <UsersIcon size={14} />
                {drill.type} for {drill.players}{' '}
                {drill.players === 1 ? 'player' : 'players'}
              </span>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <Markdown>{drill.description ?? ''}</Markdown>
            </div>

            <Copy />
          </div>

          <div className="w-full aspect-[9/16] rounded-lg shadow overflow-hidden flex justify-center items-center bg-black sm:top-[100px] sm:sticky">
            {!videoUri ? (
              <div className="text-white">No video available</div>
            ) : isYouTube ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&mute=1`}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="w-full h-full"
                controls
                controlsList="nodownload"
              >
                <source src={videoUri} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

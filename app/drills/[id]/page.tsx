'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { drill } from '@/lib/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, CircleXIcon, LoaderIcon } from 'lucide-react';
import { Hero } from '@/components/hero';
import Link from 'next/link';
import { Section } from '@/components/section';
import { Copy } from '@/components/atoms/Copy';

export default function DrillPage() {
  const [drill, setDrill] = useState<drill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const supabase = createClient();
    const fetchDrill = async () => {
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        setError(error);
        console.log(error);
      } else {
        setDrill(data);
      }
      setLoading(false);
    };
    fetchDrill();
  }, [id]);

  useEffect(() => {
    const loadVideo = async () => {
      if (!drill) return;

      setVideoLoading(true);
      let finalSource = drill.link?.trim();

      // If no public link, attempt to fetch signed URL from Supabase
      if (!finalSource) {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from('premium-drills')
          .createSignedUrl(`${drill.id}.mp4`, 60 * 60 * 5); // 5-hour expiry

        if (error || !data?.signedUrl) {
          console.error('Error fetching Supabase video:', error);
          setVideoLoading(false);
          return;
        }

        finalSource = data.signedUrl;
      }

      setVideoUri(finalSource);
      setVideoLoading(false);
    };

    loadVideo();
  }, [drill]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 gap-2">
        <LoaderIcon className="animate-spin" />
        Loading
      </div>
    );
  }

  if (error?.code === 'PGRST116') {
    router.replace('/404');
    return;
  }

  if (error || !drill) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 gap-2">
        <CircleXIcon />
        Error loading drill
      </div>
    );
  }

  const isYouTube = videoUri && !videoUri.includes('supabase');

  return (
    <>
      <Hero title={drill.name} />
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 order-1 sm:order-none flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <Link
                className="flex items-center gap-1 underline text-gray-500"
                href={'/drills'}
              >
                <ArrowLeftIcon size={16} />
                Back to all drills
              </Link>
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {drill.category}
              </span>
            </div>
            <div>{drill.description}</div>
            <Copy />
          </div>
          <div className="w-full aspect-[9/16] rounded-lg shadow overflow-hidden flex justify-center items-center bg-black">
            {videoLoading ? (
              <LoaderIcon className="animate-spin text-white" />
            ) : !videoUri ? (
              <div className="text-white">No video available</div>
            ) : isYouTube ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${drill.link}?rel=0&modestbranding=1&mute=1`}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { drill } from '@/lib/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CircleXIcon, LoaderIcon } from 'lucide-react';
import { Hero } from '@/components/hero';
import Link from 'next/link';

export default function DrillPage() {
  const [drill, setDrill] = useState<drill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify- items-center mt-10 gap-2">
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
      <div className="flex flex-col justify- items-center mt-10 gap-2">
        <CircleXIcon />
        Error loading drill
      </div>
    );
  }

  return (
    <>
      <Hero title={drill.name} />
      <div className="flex flex-col-reverse sm:flex-row gap-6">
        <div className="flex flex-col flex-1 gap-4">
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
        </div>
        {drill.link ? (
          <iframe
            className="aspect-[9/16] sm:flex-0 sm:h-[400px] rounded-lg"
            src="https://youtube.com/embed/i_xkF-DAm3U"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video className="w-full h-auto" controls>
            <source src={drill.link} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </>
  );
}

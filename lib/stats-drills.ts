// src/lib/stats-drills.ts
import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

type StatsDrills = {
  ok: true;
  totalCount: number;
  freeCount: number;
  premiumCount: number;
};

const ONE_WEEK = 60 * 60 * 24 * 7;

async function loadStatsDrills(): Promise<StatsDrills> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase env vars.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [totalResult, freeResult, premiumResult] = await Promise.all([
    supabase.from('drills').select('*', { count: 'exact', head: true }),

    supabase
      .from('drills')
      .select('*', { count: 'exact', head: true })
      .eq('premium', false),

    supabase
      .from('drills')
      .select('*', { count: 'exact', head: true })
      .eq('premium', true),
  ]);

  const error = totalResult.error || freeResult.error || premiumResult.error;

  if (error) {
    throw new Error(error.message);
  }

  return {
    ok: true,
    totalCount: totalResult.count ?? 0,
    freeCount: freeResult.count ?? 0,
    premiumCount: premiumResult.count ?? 0,
  };
}

export const getStatsDrills = unstable_cache(
  loadStatsDrills,
  ['stats-drills'],
  {
    revalidate: ONE_WEEK,
    tags: ['stats-drills'],
  }
);

import { createClient } from '@/lib/supabase/server';
import type { Drill } from '@/lib/types';
import DrillGridClient from './DrillGridClient';

export default async function DrillGrid() {
  const supabase = await createClient();

  let query = supabase.from('drills').select(
    `
      id,
      name,
      type,
      premium,
      description,
      link,
      players,
      categories ( name )
    `
  );

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const drills: Drill[] = (data ?? []).map((d: any) => ({
    ...d,
    categories: Array.isArray(d.categories)
      ? [...new Set(d.categories.map((c: any) => c?.name).filter(Boolean))]
      : [],
  }));

  return <DrillGridClient initialDrills={drills} />;
}

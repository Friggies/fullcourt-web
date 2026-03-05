import { createPublicServerClient } from '@/lib/supabase/server-public';
import type { MetadataRoute } from 'next';

export const runtime = 'nodejs';
export const revalidate = 3600;

const baseUrl = 'https://fullcourt-training.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicServerClient();

  const [
    { data: articles, error: articlesError },
    { data: drills, error: drillsError },
  ] = await Promise.all([
    supabase.from('articles').select('id, created_at'),
    supabase.from('drills').select('id').eq('premium', false),
  ]);

  if (articlesError) throw new Error(articlesError.message);
  if (drillsError) throw new Error(drillsError.message);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/drills`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonial`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];

  const blogPostRoutes: MetadataRoute.Sitemap =
    (articles ?? []).map(a => ({
      url: `${baseUrl}/blog/${a.id}`,
      lastModified: a.created_at ? new Date(a.created_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })) ?? [];

  const drillRoutes: MetadataRoute.Sitemap =
    (drills ?? []).map(d => ({
      url: `${baseUrl}/drills/${d.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })) ?? [];

  return [...staticRoutes, ...blogPostRoutes, ...drillRoutes];
}

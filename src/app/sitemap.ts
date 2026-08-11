import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  const supabase = createClient();

  const staticRoutes = [
    '', 'policies', 'policies/politics', 'policies/economy', 'policies/others',
    'analysis-opinion', 'search', 'about', 'editorial-policy', 'contact', 'privacy',
  ].map((path) => ({
    url: `${siteUrl}/${path}`,
    lastModified: new Date(),
  }));

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const { data: authors } = await supabase.from('authors').select('slug');

  const articleRoutes = (articles ?? []).map((a) => ({
    url: `${siteUrl}/article/${a.slug}`,
    lastModified: new Date(a.updated_at),
  }));

  const authorRoutes = (authors ?? []).map((a) => ({
    url: `${siteUrl}/author/${a.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articleRoutes, ...authorRoutes];
}

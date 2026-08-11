import { createClient } from '@/lib/supabase/server';
import type { Article, SiteSettings, SocialLink } from '@/types';

const ARTICLE_SELECT = `
  *,
  author:authors(*),
  category:categories(*),
  tags:article_tags(tag:tags(*))
`;

function normalizeTags(article: any): Article {
  return {
    ...article,
    tags: article.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  return (
    data ?? {
      site_name: 'State Affairs',
      logo_url: null,
      site_description: null,
      contact_email: null,
      editorial_email: null,
      tip_email: null,
      seo_default_title: null,
      seo_default_description: null,
    }
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = createClient();
  const { data } = await supabase.from('social_links').select('*').order('sort_order');
  return data ?? [];
}

export async function getHomeArticles() {
  const supabase = createClient();
  const base = supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const [{ data: bd }, { data: wd }] = await Promise.all([
    base.eq('section', 'bangladesh').limit(7),
    base.eq('section', 'world').limit(7),
  ]);

  return {
    bangladesh: (bd ?? []).map(normalizeTags),
    world: (wd ?? []).map(normalizeTags),
  };
}

export async function getArticleBySlug(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data ? normalizeTags(data) : null;
}

export async function getRelatedArticles(article: Article) {
  const supabase = createClient();
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('category_id', article.category_id ?? '')
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(4);
  return (data ?? []).map(normalizeTags);
}

export async function getArticlesByPolicySubcategory(sub: 'politics' | 'economy' | 'others') {
  const supabase = createClient();
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('policy_subcategory', sub)
    .single();
  if (!cat) return [];
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('category_id', cat.id)
    .order('published_at', { ascending: false });
  return (data ?? []).map(normalizeTags);
}

export async function getAnalysisOpinionArticles() {
  const supabase = createClient();
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('article_type', 'analysis_opinion')
    .order('published_at', { ascending: false });
  return (data ?? []).map(normalizeTags);
}

export async function getAuthorBySlug(slug: string) {
  const supabase = createClient();
  const { data: author } = await supabase.from('authors').select('*').eq('slug', slug).single();
  if (!author) return null;
  const { data: articles } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('author_id', author.id)
    .order('published_at', { ascending: false });
  return { author, articles: (articles ?? []).map(normalizeTags) };
}

export async function searchArticles(query: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,body.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(30);
  return (data ?? []).map(normalizeTags);
}

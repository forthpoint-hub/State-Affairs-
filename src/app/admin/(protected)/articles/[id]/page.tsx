import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';
import { createClient } from '@/lib/supabase/server';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: article }, { data: authors }, { data: categories }, { data: tagRows }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', params.id).single(),
    supabase.from('authors').select('id, name').order('name'),
    supabase.from('categories').select('id, name, policy_subcategory, is_analysis_opinion').order('sort_order'),
    supabase.from('article_tags').select('tag:tags(name)').eq('article_id', params.id),
  ]);

  if (!article) notFound();

  const tags = (tagRows ?? []).map((r: any) => r.tag?.name).filter(Boolean).join(', ');
  const publishAtLocal = article.publish_at
    ? new Date(article.publish_at).toISOString().slice(0, 16)
    : '';

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleEditor
        initial={{
          id: article.id,
          title: article.title,
          subtitle: article.subtitle ?? '',
          body: article.body ?? '',
          section: article.section ?? '',
          article_type: article.article_type,
          category_id: article.category_id ?? '',
          author_id: article.author_id ?? '',
          featured_image_url: article.featured_image_url ?? '',
          featured_image_caption: article.featured_image_caption ?? '',
          tags,
          seo_title: article.seo_title ?? '',
          seo_description: article.seo_description ?? '',
          slug: article.slug,
          publish_at: publishAtLocal,
        }}
        authors={authors ?? []}
        categories={categories ?? []}
        status={article.status}
      />
    </div>
  );
}

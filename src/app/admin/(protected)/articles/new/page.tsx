import ArticleEditor from '@/components/admin/ArticleEditor';
import { createClient } from '@/lib/supabase/server';

export default async function NewArticlePage() {
  const supabase = createClient();
  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from('authors').select('id, name').order('name'),
    supabase.from('categories').select('id, name, policy_subcategory, is_analysis_opinion').order('sort_order'),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">New Article</h1>
      <ArticleEditor initial={{}} authors={authors ?? []} categories={categories ?? []} />
    </div>
  );
}

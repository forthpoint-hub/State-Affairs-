import Link from 'next/link';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: total },
    { count: drafts },
    { count: published },
    { count: scheduled },
    { count: authors },
    { count: categories },
    { data: recent },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabase.from('authors').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase
      .from('articles')
      .select('id, title, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: 'Total Articles', value: total ?? 0 },
    { label: 'Drafts', value: drafts ?? 0 },
    { label: 'Published', value: published ?? 0 },
    { label: 'Scheduled', value: scheduled ?? 0 },
    { label: 'Authors', value: authors ?? 0 },
    { label: 'Categories', value: categories ?? 0 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/articles/new" className="bg-accent text-white text-sm px-4 py-2 rounded-md">
          + New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-line rounded-lg p-4">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg font-bold mb-3">Recent Articles</h2>
      <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
        {(recent ?? []).map((a) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium">{a.title || '(untitled)'}</div>
              <div className="text-xs text-muted">{format(new Date(a.updated_at), 'MMM d, yyyy h:mm a')}</div>
            </div>
            <span className="text-xs uppercase px-2 py-1 rounded bg-line text-muted">{a.status}</span>
          </Link>
        ))}
        {(recent ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-muted text-center">No articles yet.</p>
        )}
      </div>
    </div>
  );
}

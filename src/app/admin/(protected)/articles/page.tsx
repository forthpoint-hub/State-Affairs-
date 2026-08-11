import Link from 'next/link';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

const STATUSES = ['all', 'draft', 'scheduled', 'published', 'archived'] as const;

export default async function AdminArticlesList({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status ?? 'all';
  const supabase = createClient();

  let query = supabase
    .from('articles')
    .select('id, title, status, updated_at, publish_at')
    .order('updated_at', { ascending: false });

  if (status !== 'all') query = query.eq('status', status);

  const { data: articles } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new" className="bg-accent text-white text-sm px-4 py-2 rounded-md">
          + New
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/articles' : `/admin/articles?status=${s}`}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border ${
              status === s ? 'bg-ink text-paper border-ink' : 'border-line text-muted'
            }`}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
        {(articles ?? []).map((a) => (
          <Link key={a.id} href={`/admin/articles/${a.id}`} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium">{a.title || '(untitled)'}</div>
              <div className="text-xs text-muted">
                {a.status === 'scheduled' && a.publish_at
                  ? `Scheduled for ${format(new Date(a.publish_at), 'MMM d, yyyy h:mm a')}`
                  : format(new Date(a.updated_at), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <span className="text-xs uppercase px-2 py-1 rounded bg-line text-muted shrink-0 ml-2">
              {a.status}
            </span>
          </Link>
        ))}
        {(articles ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-muted text-center">No articles in this view.</p>
        )}
      </div>
    </div>
  );
}

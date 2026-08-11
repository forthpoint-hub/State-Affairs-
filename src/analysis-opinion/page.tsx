import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAnalysisOpinionArticles } from '@/lib/data';

export const revalidate = 60;
export const metadata = { title: 'Analysis & Opinion' };

export default async function AnalysisOpinionPage() {
  const articles = await getAnalysisOpinionArticles();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">Analysis & Opinion</h1>
      <p className="text-muted mb-10">Long-form analysis, editorial perspective and commentary.</p>

      {articles.length === 0 ? (
        <p className="text-muted py-12 text-center">No analysis or opinion pieces published yet.</p>
      ) : (
        <div className="divide-y divide-line">
          {articles.map((a) => (
            <Link key={a.id} href={`/article/${a.slug}`} className="flex gap-5 py-6 group">
              {a.featured_image_url && (
                <div className="relative w-28 h-28 md:w-40 md:h-28 shrink-0 bg-line overflow-hidden">
                  <Image src={a.featured_image_url} alt={a.title} fill className="object-cover" />
                </div>
              )}
              <div>
                <span className="text-xs uppercase tracking-wide text-accent font-semibold">
                  Opinion
                </span>
                <h2 className="font-serif text-xl font-bold mt-1 group-hover:underline">{a.title}</h2>
                {a.subtitle && <p className="text-muted text-sm mt-1 line-clamp-2">{a.subtitle}</p>}
                <div className="text-xs text-muted mt-2">
                  {a.author?.name}
                  {a.published_at && ` · ${format(new Date(a.published_at), 'MMM d, yyyy')}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

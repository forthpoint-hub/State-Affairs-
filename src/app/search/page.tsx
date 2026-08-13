import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import ArticleCard from '@/components/ArticleCard';
import { searchArticles } from '@/lib/data';

export const metadata = { title: 'Search' };

async function Results({ q }: { q: string }) {
  if (!q) return null;
  const results = await searchArticles(q);
  return (
    <div className="mt-10">
      <p className="text-sm text-muted mb-6">
        {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? '';
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Search</h1>
      <Suspense>
        <SearchBar />
      </Suspense>
      <Suspense fallback={<p className="mt-10 text-muted">Searching...</p>}>
        <Results q={q} />
      </Suspense>
    </div>
  );
}

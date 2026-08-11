import ArticleCard from './ArticleCard';
import type { Article } from '@/types';

export default function ArticleListingPage({
  title,
  description,
  articles,
}: {
  title: string;
  description?: string;
  articles: Article[];
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="text-muted mb-8">{description}</p>}
      {articles.length === 0 ? (
        <p className="text-muted py-12 text-center">No articles published in this section yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

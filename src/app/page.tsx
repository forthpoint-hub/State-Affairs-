import ArticleCard from '@/components/ArticleCard';
import { getHomeArticles } from '@/lib/data';

export const revalidate = 60;

function Section({ title, articles }: { title: string; articles: any[] }) {
  if (articles.length === 0) return null;
  const [featured, ...rest] = articles;
  return (
    <section className="mb-14">
      <h2 className="font-serif text-2xl font-bold border-b-2 border-ink pb-2 mb-6">{title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ArticleCard article={featured} size="large" />
        </div>
        <div className="flex flex-col gap-6">
          {rest.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
      {rest.length > 3 && (
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {rest.slice(3).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const { bangladesh, world } = await getHomeArticles();

  if (bangladesh.length === 0 && world.length === 0) {
    return (
      <div className="text-center py-24 text-muted">
        <p className="font-serif text-xl">No published articles yet.</p>
        <p className="mt-2 text-sm">Publish your first story from the CMS at /admin.</p>
      </div>
    );
  }

  return (
    <div>
      <Section title="Bangladesh" articles={bangladesh} />
      <Section title="World" articles={world} />
    </div>
  );
}

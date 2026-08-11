import { notFound } from 'next/navigation';
import Image from 'next/image';
import ArticleCard from '@/components/ArticleCard';
import { getAuthorBySlug } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const result = await getAuthorBySlug(params.slug);
  if (!result) return {};
  return { title: result.author.name };
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const result = await getAuthorBySlug(params.slug);
  if (!result) notFound();
  const { author, articles } = result;

  return (
    <div>
      <div className="flex items-center gap-5 pb-8 border-b border-line">
        {author.photo_url && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 bg-line">
            <Image src={author.photo_url} alt={author.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="font-serif text-2xl font-bold">{author.name}</h1>
          {author.role_title && <p className="text-muted text-sm">{author.role_title}</p>}
        </div>
      </div>

      {author.bio && <p className="text-muted mt-6 max-w-2xl">{author.bio}</p>}

      <h2 className="font-serif text-xl font-bold mt-12 mb-6">Articles</h2>
      {articles.length === 0 ? (
        <p className="text-muted">No published articles yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import { getArticleBySlug, getRelatedArticles } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  const title = article.seo_title || article.title;
  const description = article.seo_description || article.subtitle || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: article.author ? [article.author.name] : undefined,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.subtitle,
    image: article.featured_image_url ? [article.featured_image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: article.author ? { '@type': 'Person', name: article.author.name } : undefined,
    publisher: { '@type': 'Organization', name: 'State Affairs' },
    mainEntityOfPage: `${siteUrl}/article/${article.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {article.category && (
        <Link
          href={`/policies/${article.category.slug}`}
          className="text-xs uppercase tracking-wide text-accent font-semibold"
        >
          {article.category.name}
        </Link>
      )}

      <h1 className="font-serif text-3xl md:text-4xl font-bold mt-2 leading-tight">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="text-lg text-muted mt-3 font-serif italic">{article.subtitle}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-muted mt-5 border-b border-line pb-5">
        {article.author && (
          <Link href={`/author/${article.author.slug}`} className="font-medium text-ink hover:text-accent">
            {article.author.name}
          </Link>
        )}
        {article.published_at && (
          <span>· {format(new Date(article.published_at), 'MMMM d, yyyy, h:mm a')}</span>
        )}
        {article.updated_at && article.published_at && article.updated_at !== article.published_at && (
          <span className="text-xs">
            (Updated {format(new Date(article.updated_at), 'MMM d, yyyy')})
          </span>
        )}
      </div>

      {article.featured_image_url && (
        <figure className="mt-6">
          <div className="relative w-full aspect-[16/9] bg-line">
            <Image
              src={article.featured_image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.featured_image_caption && (
            <figcaption className="text-xs text-muted mt-2">
              {article.featured_image_caption}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose-article mt-8 text-[17px] leading-relaxed whitespace-pre-wrap"
      >
        {article.body}
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-line">
          {article.tags.map((t) => (
            <span key={t.id} className="text-xs bg-line/60 px-3 py-1 rounded-full text-muted">
              #{t.name}
            </span>
          ))}
        </div>
      )}

      <ShareButtons title={article.title} slug={article.slug} />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-xl font-bold border-b-2 border-ink pb-2 mb-6">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const url = `${siteUrl}/article/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return (
    <div className="flex gap-3 mt-8 text-sm">
      <a
        className="underline text-muted hover:text-accent"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on Facebook
      </a>
      <a
        className="underline text-muted hover:text-accent"
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on X
      </a>
    </div>
  );
}

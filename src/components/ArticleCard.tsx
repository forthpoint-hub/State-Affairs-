import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';

export default function ArticleCard({ article, size = 'default' }: { article: Article; size?: 'default' | 'large' }) {
  const isLarge = size === 'large';
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {article.featured_image_url && (
        <div className={`relative w-full overflow-hidden bg-line ${isLarge ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}>
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
            sizes={isLarge ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
          />
        </div>
      )}
      <div className="pt-3">
        {article.category && (
          <span className="text-xs uppercase tracking-wide text-accent font-semibold">
            {article.category.name}
          </span>
        )}
        <h3 className={`font-serif font-bold text-ink leading-snug mt-1 group-hover:underline ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {article.title}
        </h3>
        {article.subtitle && (
          <p className="text-muted mt-1 text-sm line-clamp-2">{article.subtitle}</p>
        )}
        <div className="text-xs text-muted mt-2 flex gap-2">
          {article.author && <span>{article.author.name}</span>}
          {article.published_at && (
            <span>· {format(new Date(article.published_at), 'MMM d, yyyy')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import type { SocialLink } from '@/types';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export default function Footer({
  siteName,
  socialLinks,
}: {
  siteName: string;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="border-t border-line mt-16 py-10 text-sm text-muted">
      <div className="max-w-content mx-auto px-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
        </div>
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="capitalize hover:text-accent"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}
        <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/policies', label: 'Policies' },
  { href: '/analysis-opinion', label: 'Analysis & Opinion' },
  { href: '/search', label: 'Search' },
];

export default function Header({ siteName }: { siteName: string }) {
  return (
    <header className="border-b border-line bg-paper sticky top-0 z-30">
      <div className="max-w-content mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
          {siteName}
        </Link>
        <nav className="flex gap-4 text-sm overflow-x-auto whitespace-nowrap">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink/80 hover:text-accent transition-colors py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

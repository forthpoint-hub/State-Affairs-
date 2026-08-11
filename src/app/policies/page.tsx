import Link from 'next/link';

const SUBS = [
  { href: '/policies/politics', label: 'Politics', desc: 'Political developments, governance and policy debates.' },
  { href: '/policies/economy', label: 'Economy', desc: 'Economic policy, markets, trade and fiscal affairs.' },
  { href: '/policies/others', label: 'Others', desc: 'Other policy areas shaping public life.' },
];

export const metadata = { title: 'Policies' };

export default function PoliciesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Policies</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        {SUBS.map((s) => (
          <Link key={s.href} href={s.href} className="border border-line rounded-lg p-5 hover:border-accent transition-colors">
            <h2 className="font-serif text-xl font-bold">{s.label}</h2>
            <p className="text-muted text-sm mt-2">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

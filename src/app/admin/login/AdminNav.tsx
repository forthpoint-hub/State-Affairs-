'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      {/* Top bar */}
      <div className="border-b border-line px-4 py-3 flex items-center justify-between sticky top-0 bg-paper z-30">
        <span className="font-serif font-bold">State Affairs CMS</span>
        <button onClick={handleLogout} className="text-sm text-muted underline">
          Sign out ({adminName})
        </button>
      </div>

      {/* Bottom tab bar — thumb-friendly on iPhone */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-line bg-paper flex z-30 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 text-center py-3 text-sm ${active ? 'text-accent font-semibold' : 'text-muted'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

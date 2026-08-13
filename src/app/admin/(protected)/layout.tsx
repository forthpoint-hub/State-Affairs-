import { requireAdmin } from '@/lib/supabase/require-admin';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav adminName={admin.name} />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">{children}</main>
    </div>
  );
}

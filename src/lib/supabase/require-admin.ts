import { redirect } from 'next/navigation';
import { createClient } from './server';

// Call at the top of any admin Server Component or Server Action.
// Confirms there's a logged-in Supabase Auth user AND that user is
// listed in the `admins` table, then returns their id.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: admin } = await supabase
    .from('admins')
    .select('id, name')
    .eq('id', user.id)
    .single();

  if (!admin) redirect('/admin/login');

  return admin;
}

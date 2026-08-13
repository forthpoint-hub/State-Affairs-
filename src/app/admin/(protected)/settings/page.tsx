import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function SettingsPage() {
  const supabase = createClient();
  const [{ data: settings }, { data: socialLinks }] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase.from('social_links').select('*').order('sort_order'),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Settings</h1>
      <SettingsForm initialSettings={settings} initialSocialLinks={socialLinks ?? []} />
    </div>
  );
}

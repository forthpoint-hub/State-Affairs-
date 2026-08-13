'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';

export interface SettingsFormData {
  site_name: string;
  logo_url: string;
  site_description: string;
  contact_email: string;
  editorial_email: string;
  tip_email: string;
  seo_default_title: string;
  seo_default_description: string;
}

export async function updateSettings(form: SettingsFormData) {
  await requireAdmin();
  const db = createAdminClient();
  await db
    .from('site_settings')
    .update({
      site_name: form.site_name,
      logo_url: form.logo_url || null,
      site_description: form.site_description || null,
      contact_email: form.contact_email || null,
      editorial_email: form.editorial_email || null,
      tip_email: form.tip_email || null,
      seo_default_title: form.seo_default_title || null,
      seo_default_description: form.seo_default_description || null,
    })
    .eq('id', 1);
  revalidatePath('/', 'layout');
  revalidatePath('/contact');
}

export async function updateSocialLinks(links: { id?: string; platform: string; url: string }[]) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from('social_links').delete().neq('platform', '__never__');
  if (links.length > 0) {
    await db
      .from('social_links')
      .insert(links.map((l, i) => ({ platform: l.platform, url: l.url, sort_order: i })));
  }
  revalidatePath('/', 'layout');
  revalidatePath('/contact');
}

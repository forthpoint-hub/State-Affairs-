'use client';

import { useState, useTransition } from 'react';
import { updateSettings, updateSocialLinks, type SettingsFormData } from '@/app/admin/(protected)/settings/actions';

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
}

export default function SettingsForm({
  initialSettings,
  initialSocialLinks,
}: {
  initialSettings: any;
  initialSocialLinks: SocialLink[];
}) {
  const [form, setForm] = useState<SettingsFormData>({
    site_name: initialSettings?.site_name ?? 'State Affairs',
    logo_url: initialSettings?.logo_url ?? '',
    site_description: initialSettings?.site_description ?? '',
    contact_email: initialSettings?.contact_email ?? '',
    editorial_email: initialSettings?.editorial_email ?? '',
    tip_email: initialSettings?.tip_email ?? '',
    seo_default_title: initialSettings?.seo_default_title ?? '',
    seo_default_description: initialSettings?.seo_default_description ?? '',
  });
  const [links, setLinks] = useState<SocialLink[]>(
    initialSocialLinks.length ? initialSocialLinks : [{ platform: 'facebook', url: '' }]
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SettingsFormData>(key: K, value: SettingsFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateLink(i: number, key: keyof SocialLink, value: string) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)));
  }

  function handleSave() {
    startTransition(async () => {
      await updateSettings(form);
      await updateSocialLinks(links.filter((l) => l.url.trim()));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-5 pb-10">
      <Field label="Site Name">
        <input className="input" value={form.site_name} onChange={(e) => update('site_name', e.target.value)} />
      </Field>
      <Field label="Logo URL">
        <input className="input" value={form.logo_url} onChange={(e) => update('logo_url', e.target.value)} />
      </Field>
      <Field label="Site Description">
        <textarea
          className="input"
          value={form.site_description}
          onChange={(e) => update('site_description', e.target.value)}
        />
      </Field>

      <div className="pt-2 border-t border-line" />
      <h2 className="font-serif font-bold">Contact</h2>
      <Field label="General Contact Email">
        <input className="input" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)} />
      </Field>
      <Field label="Editorial Contact Email">
        <input
          className="input"
          value={form.editorial_email}
          onChange={(e) => update('editorial_email', e.target.value)}
        />
      </Field>
      <Field label="News Tips Email">
        <input className="input" value={form.tip_email} onChange={(e) => update('tip_email', e.target.value)} />
      </Field>

      <div className="pt-2 border-t border-line" />
      <h2 className="font-serif font-bold">SEO Defaults</h2>
      <Field label="Default SEO Title">
        <input
          className="input"
          value={form.seo_default_title}
          onChange={(e) => update('seo_default_title', e.target.value)}
        />
      </Field>
      <Field label="Default SEO Description">
        <textarea
          className="input"
          value={form.seo_default_description}
          onChange={(e) => update('seo_default_description', e.target.value)}
        />
      </Field>

      <div className="pt-2 border-t border-line" />
      <h2 className="font-serif font-bold">Social Links</h2>
      {links.map((l, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <select className="input" value={l.platform} onChange={(e) => updateLink(i, 'platform', e.target.value)}>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <input
            className="input"
            placeholder="https://..."
            value={l.url}
            onChange={(e) => updateLink(i, 'url', e.target.value)}
          />
        </div>
      ))}
      

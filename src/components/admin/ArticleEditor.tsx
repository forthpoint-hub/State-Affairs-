'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  saveDraft,
  publishArticle,
  scheduleArticle,
  unpublishArticle,
  archiveArticle,
  deleteArticle,
  type ArticleFormData,
} from '@/app/admin/(protected)/articles/actions';

interface Option {
  id: string;
  name: string;
}

export default function ArticleEditor({
  initial,
  authors,
  categories,
  status,
}: {
  initial: Partial<ArticleFormData> & { id?: string };
  authors: Option[];
  categories: (Option & { policy_subcategory: string | null; is_analysis_opinion: boolean })[];
  status?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState<ArticleFormData>({
    id: initial.id,
    title: initial.title ?? '',
    subtitle: initial.subtitle ?? '',
    body: initial.body ?? '',
    section: (initial.section as any) ?? '',
    article_type: (initial.article_type as any) ?? 'news',
    category_id: initial.category_id ?? '',
    author_id: initial.author_id ?? '',
    featured_image_url: initial.featured_image_url ?? '',
    featured_image_caption: initial.featured_image_caption ?? '',
    tags: initial.tags ?? '',
    seo_title: initial.seo_title ?? '',
    seo_description: initial.seo_description ?? '',
    slug: initial.slug ?? '',
    publish_at: initial.publish_at ?? '',
  });
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `articles/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      update('featured_image_url', data.publicUrl);
    }
    setUploading(false);
  }

  function handleSaveDraft() {
    startTransition(async () => {
      const id = await saveDraft(form);
      setMessage('Draft saved.');
      if (!form.id && id) router.replace(`/admin/articles/${id}`);
    });
  }

  function handlePublish() {
    startTransition(async () => {
      await publishArticle(form);
    });
  }

  function handleSchedule() {
    if (!form.publish_at) {
      setMessage('Pick a date and time first.');
      return;
    }
    startTransition(async () => {
      await scheduleArticle(form);
    });
  }

  return (
    <div className="space-y-5 pb-10">
      {status && (
        <span className="inline-block text-xs uppercase px-2 py-1 rounded bg-line text-muted">
          {status}
        </span>
      )}

      <Field label="Title">
        <input
          className="input"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Article title"
        />
      </Field>

      <Field label="Subtitle / Standfirst">
        <input
          className="input"
          value={form.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Article Type">
          <select
            className="input"
            value={form.article_type}
            onChange={(e) => update('article_type', e.target.value as any)}
          >
            <option value="news">News</option>
            <option value="analysis_opinion">Analysis & Opinion</option>
          </select>
        </Field>
        <Field label="Section">
          <select className="input" value={form.section} onChange={(e) => update('section', e.target.value as any)}>
            <option value="">—</option>
            <option value="bangladesh">Bangladesh</option>
            <option value="world">World</option>
          </select>
        </Field>
      </div>

      <Field label="Category">
        <select className="input" value={form.category_id} onChange={(e) => update('category_id', e.target.value)}>
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Author">
        <select className="input" value={form.author_id} onChange={(e) => update('author_id', e.target.value)}>
          <option value="">—</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Featured Image">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
        {uploading && <p className="text-xs text-muted mt-1">Uploading...</p>}
        {form.featured_image_url && (
          <img src={form.featured_image_url} alt="" className="mt-2 rounded-md w-full max-h-48 object-cover" />
        )}
      </Field>

      <Field label="Image Caption">
        <input
          className="input"
          value={form.featured_image_caption}
          onChange={(e) => update('featured_image_caption', e.target.value)}
        />
      </Field>

      <Field label="Article Body">
        <textarea
          className="input min-h-[300px] leading-relaxed"
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
        />
      </Field>

      <Field label="Tags (comma-separated)">
        <input className="input" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
      </Field>

      <Field label="URL Slug (leave blank to auto-generate from title)">
        <input className="input" value={form.slug} onChange={(e) => update('slug', e.target.value)} />
      </Field>

      <Field label="SEO Title">
        <input className="input" value={form.seo_title} onChange={(e) => update('seo_title', e.target.value)} />
      </Field>

      <Field label="SEO Description">
        <textarea
          className="input"
          value={form.seo_description}
          onChange={(e) => update('seo_description', e.target.value)}
        />
      </Field>

      <Field label="Schedule for (optional)">
        <input
          type="datetime-local"
          className="input"
          value={form.publish_at}
          onChange={(e) => update('publish_at', e.target.value)}
        />
      </Field>

      {message && <p className="text-sm text-accent">{message}</p>}

      <div className="flex flex-col gap-2 sticky bottom-20 bg-paper pt-3 border-t border-line">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleSaveDraft} disabled={pending} className="btn-secondary">
            Save Draft
          </button>
          <button onClick={handleSchedule} disabled={pending} className="btn-secondary">
            Schedule
          </button>
        </div>
        <button onClick={handlePublish} disabled={pending} className="btn-primary">
          {pending ? 'Publishing...' : 'Publish'}
        </button>

        {form.id && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              onClick={() => startTransition(() => unpublishArticle(form.id!))}
              className="btn-tertiary"
            >
              Unpublish
            </button>
            <button
              onClick={() => startTransition(() => archiveArticle(form.id!))}
              className="btn-tertiary"
            >
              Archive
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this article permanently?')) {
                  startTransition(() => deleteArticle(form.id!));
                }
              }}
              className="btn-tertiary text-accent"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      

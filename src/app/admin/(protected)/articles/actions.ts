'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ArticleFormData {
  id?: string;
  title: string;
  subtitle: string;
  body: string;
  section: 'bangladesh' | 'world' | '';
  article_type: 'news' | 'analysis_opinion';
  category_id: string;
  author_id: string;
  featured_image_url: string;
  featured_image_caption: string;
  tags: string; // comma-separated
  seo_title: string;
  seo_description: string;
  slug: string;
  publish_at: string; // datetime-local value, or ''
}

function revalidatePublicPaths() {
  revalidatePath('/');
  revalidatePath('/policies/politics');
  revalidatePath('/policies/economy');
  revalidatePath('/policies/others');
  revalidatePath('/analysis-opinion');
  revalidatePath('/sitemap.xml');
}

async function upsertTags(db: ReturnType<typeof createAdminClient>, articleId: string, tagsCsv: string) {
  const names = tagsCsv.split(',').map((t) => t.trim()).filter(Boolean);
  await db.from('article_tags').delete().eq('article_id', articleId);
  for (const name of names) {
    const slug = slugify(name, { lower: true, strict: true });
    let { data: tag } = await db.from('tags').select('id').eq('slug', slug).single();
    if (!tag) {
      const { data: created } = await db.from('tags').insert({ name, slug }).select('id').single();
      tag = created;
    }
    if (tag) await db.from('article_tags').insert({ article_id: articleId, tag_id: tag.id });
  }
}

function buildPayload(form: ArticleFormData) {
  const slug = form.slug?.trim() ? slugify(form.slug, { lower: true, strict: true }) : slugify(form.title, { lower: true, strict: true });
  return {
    title: form.title,
    subtitle: form.subtitle || null,
    body: form.body,
    section: form.section || null,
    article_type: form.article_type,
    category_id: form.category_id || null,
    author_id: form.author_id || null,
    featured_image_url: form.featured_image_url || null,
    featured_image_caption: form.featured_image_caption || null,
    seo_title: form.seo_title || null,
    seo_description: form.seo_description || null,
    slug,
    updated_at: new Date().toISOString(),
  };
}

export async function saveDraft(form: ArticleFormData) {
  const admin = await requireAdmin();
  const db = createAdminClient();
  const payload = buildPayload(form);

  let id = form.id;
  if (id) {
    await db.from('articles').update({ ...payload, status: 'draft' }).eq('id', id);
  } else {
    const { data } = await db
      .from('articles')
      .insert({ ...payload, status: 'draft', created_by: admin.id })
      .select('id')
      .single();
    id = data?.id;
  }
  if (id) await upsertTags(db, id, form.tags);
  revalidatePath(`/admin/articles/${id}`);
  return id;
}

export async function publishArticle(form: ArticleFormData) {
  const admin = await requireAdmin();
  const db = createAdminClient();
  const payload = buildPayload(form);
  const now = new Date().toISOString();

  let id = form.id;
  if (id) {
    const { data: existing } = await db.from('articles').select('published_at').eq('id', id).single();
    await db
      .from('articles')
      .update({
        ...payload,
        status: 'published',
        publish_at: null,
        published_at: existing?.published_at ?? now,
      })
      .eq('id', id);
  } else {
    const { data } = await db
      .from('articles')
      .insert({ ...payload, status: 'published', published_at: now, created_by: admin.id })
      .select('id')
      .single();
    id = data?.id;
  }
  if (id) await upsertTags(db, id, form.tags);
  revalidatePublicPaths();
  if (id) revalidatePath(`/article/${payload.slug}`);
  redirect('/admin/articles');
}

export async function scheduleArticle(form: ArticleFormData) {
  const admin = await requireAdmin();
  if (!form.publish_at) throw new Error('Pick a publish date/time to schedule.');
  const db = createAdminClient();
  const payload = buildPayload(form);

  let id = form.id;
  if (id) {
    await db
      .from('articles')
      .update({ ...payload, status: 'scheduled', publish_at: new Date(form.publish_at).toISOString() })
      .eq('id', id);
  } else {
    const { data } = await db
      .from('articles')
      .insert({
        ...payload,
        status: 'scheduled',
        publish_at: new Date(form.publish_at).toISOString(),
        created_by: admin.id,
      })
      .select('id')
      .single();
    id = data?.id;
  }
  if (id) await upsertTags(db, id, form.tags);
  revalidatePath('/admin/articles');
  redirect('/admin/articles');
}

export async function unpublishArticle(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from('articles').update({ status: 'draft' }).eq('id', id);
  revalidatePublicPaths();
  revalidatePath(`/admin/articles/${id}`);
}

export async function archiveArticle(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from('articles').update({ status: 'archived' }).eq('id', id);
  revalidatePublicPaths();
  revalidatePath(`/admin/articles/${id}`);
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from('articles').delete().eq('id', id);
  revalidatePublicPaths();
  redirect('/admin/articles');
}

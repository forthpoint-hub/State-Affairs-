-- ============================================================
-- STATE AFFAIRS — DATABASE SCHEMA
-- Run this once in the Supabase SQL Editor (web dashboard).
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- ---------- ENUMS ----------
create type article_status as enum ('draft', 'scheduled', 'published', 'archived');
create type article_section as enum ('bangladesh', 'world');
create type policy_subcategory as enum ('politics', 'economy', 'others');
create type article_type as enum ('news', 'analysis_opinion');

-- ---------- ADMINS ----------
-- Admin identity lives in Supabase Auth (auth.users). This table just
-- marks which auth users are allowed into /admin.
create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------- AUTHORS ----------
create table authors (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  role_title text,
  bio text,
  photo_url text,
  twitter_url text,
  facebook_url text,
  linkedin_url text,
  created_at timestamptz not null default now()
);

-- ---------- CATEGORIES ----------
-- Database-driven so new categories can be added later without code changes.
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  section article_section,              -- bangladesh / world (nullable for policy/analysis cats)
  policy_subcategory policy_subcategory, -- politics / economy / others (nullable)
  is_analysis_opinion boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- TAGS ----------
create table tags (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null
);

-- ---------- ARTICLES ----------
create table articles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  subtitle text,
  body text not null default '',
  section article_section,
  article_type article_type not null default 'news',
  category_id uuid references categories(id) on delete set null,
  author_id uuid references authors(id) on delete set null,
  featured_image_url text,
  featured_image_caption text,
  status article_status not null default 'draft',
  publish_at timestamptz,        -- used for scheduling
  published_at timestamptz,      -- set automatically when it goes live
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  created_by uuid references admins(id),
  created_at timestamptz not null default now()
);

create index articles_status_idx on articles (status);
create index articles_section_idx on articles (section);
create index articles_publish_at_idx on articles (publish_at);
create index articles_published_at_idx on articles (published_at desc);
create index articles_search_idx on articles using gin (
  (title || ' ' || coalesce(subtitle,'') || ' ' || body) gin_trgm_ops
);

-- ---------- ARTICLE_TAGS (many-to-many) ----------
create table article_tags (
  article_id uuid references articles(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ---------- MEDIA LIBRARY ----------
create table media (
  id uuid primary key default uuid_generate_v4(),
  storage_path text not null,
  url text not null,
  caption text,
  uploaded_by uuid references admins(id),
  created_at timestamptz not null default now()
);

-- ---------- SITE SETTINGS (single row) ----------
create table site_settings (
  id int primary key default 1,
  site_name text not null default 'State Affairs',
  logo_url text,
  site_description text,
  contact_email text,
  editorial_email text,
  tip_email text,
  seo_default_title text,
  seo_default_description text,
  constraint single_row check (id = 1)
);
insert into site_settings (id, site_name) values (1, 'State Affairs');

-- ---------- SOCIAL LINKS ----------
create table social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,   -- e.g. 'facebook', 'twitter', 'instagram'
  url text not null,
  sort_order int not null default 0
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) role: read-only, and only published articles.
-- Admins: full read/write, checked against the admins table.
-- All writes from the CMS go through server-side code using the
-- service role key, which bypasses RLS — so these policies mainly
-- protect against direct anon access to drafts/unpublished content.
-- ============================================================

alter table articles enable row level security;
alter table authors enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table article_tags enable row level security;
alter table media enable row level security;
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table admins enable row level security;

create policy "public can read published articles"
  on articles for select
  using (status = 'published');

create policy "public can read authors" on authors for select using (true);
create policy "public can read categories" on categories for select using (true);
create policy "public can read tags" on tags for select using (true);
create policy "public can read article_tags" on article_tags for select using (true);
create policy "public can read site_settings" on site_settings for select using (true);
create policy "public can read social_links" on social_links for select using (true);

-- Admins table: an admin can read their own row (used to gate /admin)
create policy "admin can read own row" on admins for select
  using (auth.uid() = id);

-- ---------- SEED CATEGORIES ----------
insert into categories (slug, name, policy_subcategory) values
  ('politics', 'Politics', 'politics'),
  ('economy', 'Economy', 'economy'),
  ('others', 'Others', 'others');

insert into categories (slug, name, is_analysis_opinion) values
  ('analysis-opinion', 'Analysis & Opinion', true);

export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type ArticleSection = 'bangladesh' | 'world';
export type PolicySubcategory = 'politics' | 'economy' | 'others';
export type ArticleType = 'news' | 'analysis_opinion';

export interface Author {
  id: string;
  slug: string;
  name: string;
  role_title: string | null;
  bio: string | null;
  photo_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  section: ArticleSection | null;
  policy_subcategory: PolicySubcategory | null;
  is_analysis_opinion: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
  section: ArticleSection | null;
  article_type: ArticleType;
  category_id: string | null;
  author_id: string | null;
  featured_image_url: string | null;
  featured_image_caption: string | null;
  status: ArticleStatus;
  publish_at: string | null;
  published_at: string | null;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  // joined
  author?: Author | null;
  category?: Category | null;
  tags?: Tag[];
}

export interface SiteSettings {
  site_name: string;
  logo_url: string | null;
  site_description: string | null;
  contact_email: string | null;
  editorial_email: string | null;
  tip_email: string | null;
  seo_default_title: string | null;
  seo_default_description: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

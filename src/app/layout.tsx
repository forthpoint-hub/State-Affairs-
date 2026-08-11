import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteSettings, getSocialLinks } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_default_title ?? settings.site_name,
      template: `%s — ${settings.site_name}`,
    },
    description: settings.seo_default_description ?? settings.site_description ?? undefined,
    openGraph: {
      siteName: settings.site_name,
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, socialLinks] = await Promise.all([getSiteSettings(), getSocialLinks()]);
  return (
    <html lang="en">
      <body>
        <Header siteName={settings.site_name} />
        <main className="max-w-content mx-auto px-4 py-8 min-h-[60vh]">{children}</main>
        <Footer siteName={settings.site_name} socialLinks={socialLinks} />
      </body>
    </html>
  );
}

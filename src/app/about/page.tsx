import { getSiteSettings } from '@/lib/data';

export const metadata = { title: 'About' };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-6">About {settings.site_name}</h1>
      <div className="prose-article space-y-4 text-[17px] leading-relaxed">
        <p>
          {settings.site_name} is an independent publication covering Bangladeshi politics,
          policy and international affairs.
        </p>
        <p>
          {settings.site_description ||
            'This page is a starting template — edit the mission, coverage areas and editorial approach from the CMS or directly in this file.'}
        </p>
        <h2 className="font-serif text-xl font-bold pt-4">Our Purpose</h2>
        <p>[Describe what State Affairs exists to do.]</p>
        <h2 className="font-serif text-xl font-bold pt-4">Coverage Areas</h2>
        <p>Bangladesh politics and policy, the national economy, and international affairs.</p>
        <h2 className="font-serif text-xl font-bold pt-4">Independence &amp; Accuracy</h2>
        <p>[Describe editorial independence, funding, and commitment to accuracy.]</p>
      </div>
    </div>
  );
}
